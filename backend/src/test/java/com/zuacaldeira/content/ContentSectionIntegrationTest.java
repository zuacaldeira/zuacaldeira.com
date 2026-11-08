package com.zuacaldeira.content;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.mysql.MySQLContainer;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

/** The generic sections of `content_section` (D11 in docs/examples/software.md). */
@Testcontainers
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class ContentSectionIntegrationTest {

    @Container
    @ServiceConnection
    static final MySQLContainer MYSQL = new MySQLContainer("mysql:8.4");

    private static final String DE_HEAD = """
            {"eyebrow": "Ausgewählte Arbeiten", "heading": "Software", "intro": "Software, die ich gebaut habe, \
            und wie ich sie an ihr Protokoll binde: zuerst aufgeschrieben, geprüft, dann testgetrieben gebaut."}""";

    @LocalServerPort
    int port;

    @Autowired
    JdbcClient jdbc;

    @BeforeEach
    void startWithNoRows() {
        jdbc.sql("DELETE FROM content_section").update();
    }

    @Test
    @DisplayName("SW-HEAD-04 answers the stored German head of the Software page as it is")
    void answersTheStoredSection() throws Exception {
        store("software", "head", "de", DE_HEAD);

        HttpResponse<String> response = get("/api/content/software/head?lang=de");

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(json(response.body())).isEqualTo(json(DE_HEAD));
    }

    @Test
    @DisplayName("SW-HEAD-P-03 answers 404 for a language the site does not have, even with a stray row for it")
    void refusesAnUnsupportedLanguageEvenWithAStrayRow() throws Exception {
        store("software", "head", "fr", DE_HEAD);

        assertMissing(get("/api/content/software/head?lang=fr"));
    }

    @Test
    @DisplayName("SW-HEAD-P-03 answers 404 for a section of the Software page that is not stored")
    void treatsAnUnknownSectionAsMissing() throws Exception {
        store("software", "head", "en", DE_HEAD);

        assertMissing(get("/api/content/software/nope?lang=en"));
    }

    private static final String DE_WRITING_HEAD = """
            {"eyebrow": "Veröffentlichungen", "heading": "Texte", "intro": "Paper über Session-Typen und über \
            Werkzeuge, die Code gegen seine Spezifikation prüfen, die neuesten zuerst. Jeder Eintrag führt dorthin, \
            wo der Text liegt."}""";

    @Test
    @DisplayName("WR-HEAD-04 answers the stored German head of the Writing page as it is")
    void answersTheStoredWritingHead() throws Exception {
        store("writing", "head", "de", DE_WRITING_HEAD);

        HttpResponse<String> response = get("/api/content/writing/head?lang=de");

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(json(response.body())).isEqualTo(json(DE_WRITING_HEAD));
    }

    @Test
    @DisplayName("WR-HEAD-P-02 answers 404 for the Writing head in a language the site does not have, even with a stray row")
    void refusesTheWritingHeadInAnUnsupportedLanguage() throws Exception {
        store("writing", "head", "fr", DE_WRITING_HEAD);

        assertMissing(get("/api/content/writing/head?lang=fr"));
    }

    @Test
    @DisplayName("WR-HEAD-P-02 answers 404 for a section of the Writing page that is not stored")
    void treatsAnUnknownWritingSectionAsMissing() throws Exception {
        store("writing", "head", "en", DE_WRITING_HEAD);

        assertMissing(get("/api/content/writing/nope?lang=en"));
    }

    /** D11's shape, one text: nested objects, an array, a number and booleans, stored as they are. */
    private static String writingTexts(String read, String kind) {
        return """
                {"inEnglish": "Em inglês", "read": "%s", "newTab": "abre num novo separador",
                 "kinds": {"workshop": "%s", "conference": "Artigo de conferência", "report": "Relatório técnico"},
                 "items": [{"id": "ice2026", "year": 2026, "kind": "workshop",
                            "title": "Session Type State Spaces Form Lattices",
                            "authors": [{"name": "Alexandre Zua Caldeira", "self": true}],
                            "venue": "ICE 2026 · International Workshop on Interaction and Concurrency Experience",
                            "note": "Versão final · a publicar na EPTCS",
                            "href": "/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf",
                            "external": false}]}""".formatted(read, kind);
    }

    @Test
    @DisplayName("WR-LIST-12 answers the stored Portuguese list of the Writing page as it is")
    void answersTheStoredWritingTexts() throws Exception {
        String ptTexts = writingTexts("Ler (PDF)", "Artigo de workshop");
        store("writing", "texts", "pt", ptTexts);
        store("writing", "texts", "en", writingTexts("Read (PDF)", "Workshop paper"));

        HttpResponse<String> response = get("/api/content/writing/texts?lang=pt");

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(json(response.body())).isEqualTo(json(ptTexts));
    }

    private static void assertMissing(HttpResponse<String> response) {
        assertThat(response.statusCode()).isEqualTo(404);
        assertThat(response.body()).isEmpty();
    }

    private static Map<String, Object> json(String body) {
        return JsonMapper.builder().build().readValue(body, new TypeReference<Map<String, Object>>() {});
    }

    private void store(String page, String section, String lang, String body) {
        jdbc.sql("INSERT INTO content_section (page, section, lang, body) VALUES (:page, :section, :lang, :body)")
                .param("page", page)
                .param("section", section)
                .param("lang", lang)
                .param("body", body)
                .update();
    }

    private HttpResponse<String> get(String path) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).build();
        try (HttpClient client = HttpClient.newHttpClient()) {
            return client.send(request, HttpResponse.BodyHandlers.ofString());
        }
    }
}
