package com.zuacaldeira.content;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import java.util.stream.Stream;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
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

/** The Research page's content in the build's database, from db/seed (docs/examples/research.md). */
@Testcontainers
@ActiveProfiles("seed")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class ResearchSeedIntegrationTest {

    @Container
    @ServiceConnection
    static final MySQLContainer MYSQL = new MySQLContainer("mysql:8.4");

    @LocalServerPort
    int port;

    static Stream<Arguments> heads() {
        return Stream.of(
                Arguments.of("en", Map.of(
                        "eyebrow", "One paper · ICE 2026",
                        "heading", "Research",
                        "intro", "The state space of every well-formed session type forms a lattice. This page is the"
                                + " paper that proves it: what it shows, how it was checked, and the tool behind it.")),
                Arguments.of("de", Map.of(
                        "eyebrow", "Ein Paper · ICE 2026",
                        "heading", "Forschung",
                        "intro", "Der Zustandsraum jedes wohlgeformten Session-Typs bildet einen Verband. Diese Seite"
                                + " stellt das Paper vor, das es beweist: was es zeigt, wie es geprüft wurde und das"
                                + " Werkzeug dahinter.")),
                Arguments.of("pt", Map.of(
                        "eyebrow", "Um artigo · ICE 2026",
                        "heading", "Investigação",
                        "intro", "O espaço de estados de todo o tipo de sessão bem formado forma um reticulado. Esta"
                                + " página apresenta o artigo que o prova: o que mostra, como foi verificado e a"
                                + " ferramenta por trás dele.")));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("heads")
    @DisplayName("RS-HEAD-05 the seed answers the agreed head of the Research page in every language")
    void answersTheSeededHead(String lang, Map<String, String> expected) throws Exception {
        HttpResponse<String> response = get("/api/content/research/head?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, String> head = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, String>>() {});
        assertThat(head).isEqualTo(expected);
        assertThat(head.values()).allSatisfy(text -> assertThat(text).isNotBlank());
    }

    static Stream<Arguments> walls() {
        return Stream.of(
                Arguments.of("en", Map.of(
                        "label", "The 74 distinct lattices of the paper’s benchmark protocols at rung R2′, ordered by"
                                + " size; the 47 that are not distributive in ochre.",
                        "caption", "74 distinct lattices, drawn from 104 of the paper’s 108 protocols at rung R2′, a"
                                + " finer construction than the paper’s own. Ochre: not distributive, 47 of the 74.",
                        "hint", "Point at a tile to name its protocol.")),
                Arguments.of("de", Map.of(
                        "label", "Die 74 verschiedenen Verbände der Benchmark-Protokolle des Papers auf Stufe R2′,"
                                + " nach Größe geordnet; die 47 nicht distributiven in Ocker.",
                        "caption", "74 verschiedene Verbände, gezeichnet aus 104 der 108 Protokolle des Papers auf"
                                + " Stufe R2′, einer feineren Konstruktion als der des Papers. Ocker: nicht distributiv,"
                                + " 47 der 74.",
                        "hint", "Zeigen Sie auf eine Kachel, um ihr Protokoll zu sehen.")),
                Arguments.of("pt", Map.of(
                        "label", "Os 74 reticulados distintos dos protocolos de referência do artigo no nível R2′, por"
                                + " tamanho; os 47 não distributivos a ocre.",
                        "caption", "74 reticulados distintos, desenhados a partir de 104 dos 108 protocolos do artigo"
                                + " no nível R2′, uma construção mais fina do que a do artigo. Ocre: não distributivos,"
                                + " 47 dos 74.",
                        "hint", "Aponte para um mosaico para ver o seu protocolo.")));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("walls")
    @DisplayName("RS-WALL-02, 06 the seed answers the wall's label, caption and hint in every language")
    void answersTheSeededWall(String lang, Map<String, String> expected) throws Exception {
        HttpResponse<String> response = get("/api/content/research/wall?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, String> wall = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, String>>() {});
        assertThat(wall).isEqualTo(expected);
        assertThat(wall.values()).allSatisfy(text -> assertThat(text).isNotBlank());
    }

    private HttpResponse<String> get(String path) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).build();
        try (HttpClient client = HttpClient.newHttpClient()) {
            return client.send(request, HttpResponse.BodyHandlers.ofString());
        }
    }
}
