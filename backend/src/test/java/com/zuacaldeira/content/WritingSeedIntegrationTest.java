package com.zuacaldeira.content;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.mysql.MySQLContainer;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

/** The Writing page's content in the build's database, from db/seed (docs/examples/writing.md). */
@Testcontainers
@ActiveProfiles("seed")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class WritingSeedIntegrationTest {

    @Container
    @ServiceConnection
    static final MySQLContainer MYSQL = new MySQLContainer("mysql:8.4");

    @LocalServerPort
    int port;

    static Stream<Arguments> heads() {
        return Stream.of(
                Arguments.of("en", Map.of(
                        "eyebrow", "Published work",
                        "heading", "Writing",
                        "intro", "Papers on session types, and on tools that check code against its specification,"
                                + " newest first. Each one links to where the text lives.")),
                Arguments.of("de", Map.of(
                        "eyebrow", "Veröffentlichungen",
                        "heading", "Texte",
                        "intro", "Paper über Session-Typen und über Werkzeuge, die Code gegen seine Spezifikation"
                                + " prüfen, die neuesten zuerst. Jeder Eintrag führt dorthin, wo der Text liegt.")),
                Arguments.of("pt", Map.of(
                        "eyebrow", "Publicações",
                        "heading", "Textos",
                        "intro", "Artigos sobre tipos de sessão e sobre ferramentas que verificam o código face à sua"
                                + " especificação, os mais recentes primeiro. Cada um leva ao sítio onde o texto está.")));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("heads")
    @DisplayName("WR-HEAD-05 the seed answers the agreed head of the Writing page in every language")
    void answersTheSeededHead(String lang, Map<String, String> expected) throws Exception {
        HttpResponse<String> response = get("/api/content/writing/head?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, String> head = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, String>>() {});
        assertThat(head).isEqualTo(expected);
        assertThat(head.values()).allSatisfy(text -> assertThat(text).isNotBlank());
    }

    private static final String PDF = "/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf";

    private static Map<String, Object> author(String name) {
        return Map.of("name", name);
    }

    private static Map<String, Object> self(String name) {
        return Map.of("name", name, "self", true);
    }

    /** The spec's English list (D11's shape, D15): the labels and the four texts, newest first. */
    private static final Map<String, Object> EN_TEXTS = Map.of(
            "inEnglish", "In English",
            "read", "Read (PDF)",
            "newTab", "opens in a new tab",
            "kinds", Map.of("workshop", "Workshop paper", "conference", "Conference paper",
                    "report", "Technical report"),
            "items", List.of(
                    Map.of("id", "ice2026", "year", 2026, "kind", "workshop",
                            "title", "Session Type State Spaces Form Lattices",
                            "authors", List.of(self("Alexandre Zua Caldeira")),
                            "venue", "ICE 2026 · International Workshop on Interaction and Concurrency Experience",
                            "note", "Camera-ready · to appear in EPTCS",
                            "href", PDF, "external", false),
                    Map.of("id", "popl2010", "year", 2010, "kind", "conference",
                            "title", "Modular Session Types for Distributed Object-Oriented Programming",
                            "authors", List.of(author("Simon J. Gay"), author("Vasco T. Vasconcelos"),
                                    author("António Ravara"), author("Nils Gesbert"), self("Alexandre Z. Caldeira")),
                            "venue", "POPL 2010 · ACM SIGPLAN Symposium on Principles of Programming Languages",
                            "href", "https://doi.org/10.1145/1706299.1706335",
                            "label", "ACM Digital Library (DOI)", "external", true),
                    Map.of("id", "fool2009", "year", 2009, "kind", "workshop",
                            "title", "Dynamic Interfaces",
                            "authors", List.of(author("Vasco T. Vasconcelos"), author("Simon J. Gay"),
                                    author("António Ravara"), author("Nils Gesbert"), self("Alexandre Z. Caldeira")),
                            "venue", "FOOL 2009 · International Workshop on Foundations of Object-Oriented Languages",
                            "href", "https://eprints.gla.ac.uk/47911/",
                            "label", "eprints.gla.ac.uk", "external", true),
                    Map.of("id", "congu2007", "year", 2007, "kind", "report",
                            "title", "ConGu, Checking Java Classes Against Property-Driven Algebraic Specifications",
                            "authors", List.of(author("João Abreu"), self("Alexandre Caldeira"),
                                    author("Antónia Lopes"), author("Isabel Nunes"), author("Luís S. Reis"),
                                    author("Vasco T. Vasconcelos")),
                            "venue", "DI/FCUL TR-07-7 · Department of Informatics, University of Lisbon",
                            "href", "https://repositorio.ulisboa.pt/handle/10451/14164",
                            "label", "repositorio.ulisboa.pt", "external", true)));

    /** The fields that are the same in every language; the note and the labels are translated. */
    private static final List<String> UNTRANSLATED =
            List.of("id", "year", "kind", "title", "authors", "venue", "href", "label", "external");

    @ParameterizedTest(name = "{0}")
    @ValueSource(strings = {"en", "de", "pt"})
    @DisplayName("WR-LIST-13 the seed answers the four texts of the Writing page in every language, none empty")
    @SuppressWarnings("unchecked")
    void answersTheSeededTexts(String lang) throws Exception {
        HttpResponse<String> response = get("/api/content/writing/texts?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, Object> texts = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, Object>>() {});
        if (lang.equals("en")) {
            assertThat(texts).isEqualTo(EN_TEXTS);
        }
        List<Map<String, Object>> items = (List<Map<String, Object>>) texts.get("items");
        List<Map<String, Object>> enItems = (List<Map<String, Object>>) EN_TEXTS.get("items");
        assertThat(items).hasSameSizeAs(enItems);
        for (int i = 0; i < enItems.size(); i++) {
            for (String field : UNTRANSLATED) {
                assertThat(items.get(i).get(field)).as("%s of text %d", field, i).isEqualTo(enItems.get(i).get(field));
            }
        }
        assertThat(items).extracting(item -> item.containsKey("note")).containsExactly(true, false, false, false);
        assertThat((String) items.get(0).get("note")).isNotBlank();
        assertThat(List.of(texts.get("inEnglish"), texts.get("read"), texts.get("newTab")))
                .allSatisfy(label -> assertThat((String) label).isNotBlank());
        assertThat((Map<String, String>) texts.get("kinds")).containsOnlyKeys("workshop", "conference", "report")
                .allSatisfy((kind, label) -> assertThat(label).isNotBlank());
    }

    private HttpResponse<String> get(String path) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).build();
        try (HttpClient client = HttpClient.newHttpClient()) {
            return client.send(request, HttpResponse.BodyHandlers.ofString());
        }
    }
}
