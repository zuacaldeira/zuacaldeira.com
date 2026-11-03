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

/** The build's database: an empty MySQL that Flyway fills from db/migration and db/seed (D24). */
@Testcontainers
@ActiveProfiles("seed")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class HomeHeroSeedIntegrationTest {

    @Container
    @ServiceConnection
    static final MySQLContainer MYSQL = new MySQLContainer("mysql:8.4");

    @LocalServerPort
    int port;

    static Map<String, Map<String, String>> seededHeroes() {
        return Map.of(
                "en", Map.of(
                        "headline", "I build software, and prove its protocols hold.",
                        "lede", "Alexandre Zua Caldeira. Software engineer in Berlin since 2011 and"
                                + " programming-languages researcher (POPL 2010, ICE 2026). Java backends,"
                                + " verification tooling, and AI agents held to a checked protocol.",
                        "workCta", "See selected work",
                        "cvCta", "Download CV",
                        "paperCta", "Read the ICE 2026 paper →",
                        "latticeLabel", "The lattice 2 to the third: software, research and running in parallel.",
                        "latticeCaption", "2³ · three threads in parallel · the atoms are links"),
                "de", Map.of(
                        "headline", "Ich baue Software und beweise, dass ihre Protokolle halten.",
                        "lede", "Alexandre Zua Caldeira. Softwareentwickler in Berlin seit 2011 und Forscher"
                                + " im Bereich Programmiersprachen (POPL 2010, ICE 2026). Java-Backends,"
                                + " Verifikationswerkzeuge und KI-Agenten, die an ein geprüftes Protokoll"
                                + " gebunden sind.",
                        "workCta", "Ausgewählte Arbeiten",
                        "cvCta", "Lebenslauf herunterladen",
                        "paperCta", "ICE-2026-Paper lesen →",
                        "latticeLabel", "Der Verband 2 hoch 3: Software, Forschung und Laufen parallel.",
                        "latticeCaption", "2³ · drei Fäden parallel · die Atome sind Links"),
                "pt", Map.of(
                        "headline", "Construo software e provo que os seus protocolos se cumprem.",
                        "lede", "Alexandre Zua Caldeira. Engenheiro de software em Berlim desde 2011 e"
                                + " investigador em linguagens de programação (POPL 2010, ICE 2026). Backends"
                                + " Java, ferramentas de verificação e agentes de IA sujeitos a um protocolo"
                                + " verificado.",
                        "workCta", "Ver trabalhos selecionados",
                        "cvCta", "Descarregar CV",
                        "paperCta", "Ler o artigo ICE 2026 →",
                        "latticeLabel", "O reticulado 2 ao cubo: software, investigação e corrida em paralelo.",
                        "latticeCaption", "2³ · três fios em paralelo · os átomos são ligações"));
    }

    static Stream<Arguments> languages() {
        return seededHeroes().entrySet().stream().map(e -> Arguments.of(e.getKey(), e.getValue()));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("languages")
    @DisplayName("HOME-HERO-15 the seed answers the agreed hero in every language")
    void answersTheSeededHero(String lang, Map<String, String> expected) throws Exception {
        HttpResponse<String> response = get("/api/content/home/hero?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, String> hero = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, String>>() {});
        assertThat(hero).isEqualTo(expected);
        assertThat(hero.values()).allSatisfy(text -> assertThat(text).isNotBlank());
    }

    private HttpResponse<String> get(String path) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).build();
        try (HttpClient client = HttpClient.newHttpClient()) {
            return client.send(request, HttpResponse.BodyHandlers.ofString());
        }
    }
}
