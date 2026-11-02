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

@Testcontainers
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class HomeHeroIntegrationTest {

    @Container
    @ServiceConnection
    static final MySQLContainer MYSQL = new MySQLContainer("mysql:8.4");

    private static final Map<String, String> PT_HERO = Map.of(
            "headline", "Construo software e provo que os seus protocolos se cumprem.",
            "lede", "Alexandre Zua Caldeira. Engenheiro de software em Berlim desde 2011 e investigador em"
                    + " linguagens de programação (POPL 2010, ICE 2026). Backends Java, ferramentas de"
                    + " verificação e agentes de IA sujeitos a um protocolo verificado.",
            "workCta", "Ver trabalhos selecionados",
            "cvCta", "Descarregar CV",
            "paperCta", "Ler o artigo ICE 2026 →",
            "latticeLabel", "O reticulado 2 ao cubo: software, investigação e corrida em paralelo.",
            "latticeCaption", "2³ · três fios em paralelo · os átomos são ligações");

    private static final Map<String, String> EN_HERO = Map.of(
            "headline", "I build software, and prove its protocols hold.",
            "lede", "Alexandre Zua Caldeira. Software engineer in Berlin since 2011 and programming-languages"
                    + " researcher (POPL 2010, ICE 2026). Java backends, verification tooling, and AI agents"
                    + " held to a checked protocol.",
            "workCta", "See selected work",
            "cvCta", "Download CV",
            "paperCta", "Read the ICE 2026 paper →",
            "latticeLabel", "The lattice 2 to the third: software, research and running in parallel.",
            "latticeCaption", "2³ · three threads in parallel · the atoms are links");

    @LocalServerPort
    int port;

    @Autowired
    JdbcClient jdbc;

    @BeforeEach
    void startWithNoRows() {
        jdbc.sql("DELETE FROM home_hero").update();
    }

    @Test
    @DisplayName("HOME-HERO-05 answers the stored Portuguese hero with exactly the seven fields")
    void answersTheStoredHero() throws Exception {
        storeHero("pt", PT_HERO);

        HttpResponse<String> response = get("/api/content/home/hero?lang=pt");

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, String>>() {})).isEqualTo(PT_HERO);
    }

    @Test
    @DisplayName("HOME-HERO-11 answers 404 for a language not stored, with no fallback to another")
    void doesNotFallBackToAnotherLanguage() throws Exception {
        storeHero("en", EN_HERO);
        storeHero("pt", PT_HERO);

        assertMissing(get("/api/content/home/hero?lang=de"));
    }

    @Test
    @DisplayName("HOME-HERO-12 answers 404 for an unknown section of a known page")
    void treatsAnUnknownSectionAsMissing() throws Exception {
        storeHero("en", EN_HERO);

        assertMissing(get("/api/content/home/nope?lang=en"));
    }

    private static void assertMissing(HttpResponse<String> response) {
        assertThat(response.statusCode()).isEqualTo(404);
        assertThat(response.body()).isEmpty();
    }

    private void storeHero(String lang, Map<String, String> hero) {
        jdbc.sql("""
                INSERT INTO home_hero
                    (lang, headline, lede, work_cta, cv_cta, paper_cta, lattice_label, lattice_caption)
                VALUES
                    (:lang, :headline, :lede, :workCta, :cvCta, :paperCta, :latticeLabel, :latticeCaption)
                """)
                .param("lang", lang)
                .params(hero)
                .update();
    }

    private HttpResponse<String> get(String path) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).build();
        try (HttpClient client = HttpClient.newHttpClient()) {
            return client.send(request, HttpResponse.BodyHandlers.ofString());
        }
    }
}
