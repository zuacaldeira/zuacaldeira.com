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

/** The About page's content in the build's database, from db/seed (docs/examples/about.md). */
@Testcontainers
@ActiveProfiles("seed")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class AboutSeedIntegrationTest {

    @Container
    @ServiceConnection
    static final MySQLContainer MYSQL = new MySQLContainer("mysql:8.4");

    @LocalServerPort
    int port;

    static Stream<Arguments> heads() {
        return Stream.of(
                Arguments.of("en", Map.of(
                        "eyebrow", "Piri → Estremoz → Lisbon → Berlin",
                        "heading", "About",
                        "intro", "My CV, told as a story: four places, what I learned and did in each, and why I"
                                + " moved on.")),
                Arguments.of("de", Map.of(
                        "eyebrow", "Piri → Estremoz → Lissabon → Berlin",
                        "heading", "Über mich",
                        "intro", "Mein Lebenslauf als Geschichte: vier Orte, was ich an jedem gelernt und getan"
                                + " habe, und warum ich weitergezogen bin.")),
                Arguments.of("pt", Map.of(
                        "eyebrow", "Piri → Estremoz → Lisboa → Berlim",
                        "heading", "Sobre",
                        "intro", "O meu currículo contado como uma história: quatro lugares, o que aprendi e fiz"
                                + " em cada um, e porque segui em frente.")));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("heads")
    @DisplayName("ABOUT-11 the seed answers the agreed head of the About page in every language, none empty")
    void answersTheSeededHead(String lang, Map<String, String> expected) throws Exception {
        HttpResponse<String> response = get("/api/content/about/head?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, String> head = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, String>>() {});
        assertThat(head).isEqualTo(expected);
        assertThat(head.values()).allSatisfy(text -> assertThat(text).isNotBlank());
    }

    /** The spec's English route (D1, D10): its labels and the four stops in route order. */
    private static final Map<String, Object> EN_ROUTE = Map.of(
            "label", "The route",
            "chapter", "Chapter {n}",
            "chapterOf", "Chapter {n} of {total}",
            "movedOn", "Why I moved on",
            "newTab", "opens in a new tab",
            "stops", List.of(
                    Map.of("id", "piri", "place", "Piri"),
                    Map.of("id", "estremoz", "place", "Estremoz"),
                    Map.of("id", "lisbon", "place", "Lisbon"),
                    Map.of("id", "berlin", "place", "Berlin")));

    static Stream<Arguments> routes() {
        return Stream.of(
                Arguments.of("en", "The route", List.of("Piri", "Estremoz", "Lisbon", "Berlin")),
                Arguments.of("de", "Der Weg", List.of("Piri", "Estremoz", "Lissabon", "Berlin")),
                Arguments.of("pt", "O percurso", List.of("Piri", "Estremoz", "Lisboa", "Berlim")));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("routes")
    @DisplayName("ABOUT-14 the seed answers the route in every language: four stops, the same ids in route order, nothing empty")
    @SuppressWarnings("unchecked")
    void answersTheSeededRoute(String lang, String label, List<String> places) throws Exception {
        HttpResponse<String> response = get("/api/content/about/route?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, Object> route = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, Object>>() {});
        if (lang.equals("en")) {
            assertThat(route).isEqualTo(EN_ROUTE);
        }
        assertThat(route.keySet()).isEqualTo(EN_ROUTE.keySet());
        assertThat(route.get("label")).isEqualTo(label);
        List<Map<String, String>> stops = (List<Map<String, String>>) route.get("stops");
        assertThat(stops).extracting(stop -> stop.get("id")).containsExactly("piri", "estremoz", "lisbon", "berlin");
        assertThat(stops).extracting(stop -> stop.get("place")).isEqualTo(places);
        assertThat(route.values()).filteredOn(String.class::isInstance)
                .allSatisfy(text -> assertThat((String) text).isNotBlank());
        assertThat((String) route.get("chapterOf")).contains("{n}", "{total}");
    }

    private HttpResponse<String> get(String path) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).build();
        try (HttpClient client = HttpClient.newHttpClient()) {
            return client.send(request, HttpResponse.BodyHandlers.ofString());
        }
    }
}
