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
