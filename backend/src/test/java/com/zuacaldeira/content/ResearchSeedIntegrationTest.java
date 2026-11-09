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
                                + " finer construction than the paper’s own.",
                        "key", "Ochre: not distributive, 47 of the 74.",
                        "hint", "Point at a tile to name its protocol.")),
                Arguments.of("de", Map.of(
                        "label", "Die 74 verschiedenen Verbände der Benchmark-Protokolle des Papers auf Stufe R2′,"
                                + " nach Größe geordnet; die 47 nicht distributiven in Ocker.",
                        "caption", "74 verschiedene Verbände, gezeichnet aus 104 der 108 Protokolle des Papers auf"
                                + " Stufe R2′, einer feineren Konstruktion als der des Papers.",
                        "key", "Ocker: nicht distributiv, 47 der 74.",
                        "hint", "Zeigen Sie auf eine Kachel, um ihr Protokoll zu sehen.")),
                Arguments.of("pt", Map.of(
                        "label", "Os 74 reticulados distintos dos protocolos de referência do artigo no nível R2′, por"
                                + " tamanho; os 47 não distributivos a ocre.",
                        "caption", "74 reticulados distintos, desenhados a partir de 104 dos 108 protocolos do artigo"
                                + " no nível R2′, uma construção mais fina do que a do artigo.",
                        "key", "Ocre: não distributivos, 47 dos 74.",
                        "hint", "Aponte para um mosaico para ver o seu protocolo.")));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("walls")
    @DisplayName("RS-WALL-02, 06, 07 the seed answers the wall's label, caption, key and hint in every language")
    void answersTheSeededWall(String lang, Map<String, String> expected) throws Exception {
        HttpResponse<String> response = get("/api/content/research/wall?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, String> wall = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, String>>() {});
        assertThat(wall).isEqualTo(expected);
        assertThat(wall.values()).allSatisfy(text -> assertThat(text).isNotBlank());
    }

    /** The spec's English card (D2's shape); author, venue and abstract are the same in every language. */
    private static final Map<String, String> EN_PAPER = Map.of(
            "kind", "Workshop paper",
            "note", "Camera-ready · to appear in EPTCS",
            "inEnglish", "In English (not shown)",
            "abstractLabel", "Abstract",
            "author", "Alexandre Zua Caldeira",
            "venue", "ICE 2026 · International Workshop on Interaction and Concurrency Experience",
            "abstract", "We prove that the state space of every well-formed session type, quotiented by strongly"
                    + " connected components, forms a bounded lattice; n-ary parallel composition yields product"
                    + " lattices. Two consequences follow: duality preserves the lattice up to isomorphism, and"
                    + " Gay–Hole width subtyping corresponds to lattice embedding for non-recursive types. We"
                    + " validate this on 108 benchmark protocols across networking, databases, distributed systems,"
                    + " AI, and fault tolerance: all form lattices, 93 distributive, 15 non-distributive. Mechanised"
                    + " in Lean 4 with two independently developed tool implementations.");

    @ParameterizedTest(name = "{0}")
    @ValueSource(strings = {"en", "de", "pt"})
    @DisplayName("RS-PAPER-07 the seed answers the paper's card in every language, the paper's fields the same in each")
    void answersTheSeededPaper(String lang) throws Exception {
        HttpResponse<String> response = get("/api/content/research/paper?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, String> paper = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, String>>() {});
        if (lang.equals("en")) {
            assertThat(paper).isEqualTo(EN_PAPER);
        }
        assertThat(paper.keySet()).isEqualTo(EN_PAPER.keySet());
        for (String same : List.of("author", "venue", "abstract")) {
            assertThat(paper.get(same)).as(same).isEqualTo(EN_PAPER.get(same));
        }
        assertThat(paper.values()).allSatisfy(text -> assertThat(text).isNotBlank());
    }

    static Stream<Arguments> results() {
        return Stream.of(
                Arguments.of("en", "What it proves"),
                Arguments.of("de", "Was es beweist"),
                Arguments.of("pt", "O que prova"));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("results")
    @DisplayName("RS-RES-01, 03, 04 the seed answers the results' heading in every language")
    void answersTheSeededResults(String lang, String heading) throws Exception {
        HttpResponse<String> response = get("/api/content/research/results?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, String>>() {})).isEqualTo(Map.of("heading", heading));
    }

    /** The figures' values, the same in every language (RS-CHECK-03): the paper's own count. */
    private static final List<String> VALUES = List.of("108", "93", "15", "Lean 4");

    /** The spec's English checks: the four figures with their meanings, and the rung note (RS-WALL-05). */
    private static final Map<String, Object> EN_CHECKED = Map.of(
            "heading", "How it was checked",
            "figures", List.of(
                    Map.of("value", "108", "label", "benchmark protocols, every one a lattice"),
                    Map.of("value", "93", "label", "distributive"),
                    Map.of("value", "15", "label", "not distributive"),
                    Map.of("value", "Lean 4", "label", "mechanised proof")),
            "rung", "The 93 and 15 are the paper’s own count over its 108 protocols. The wall draws the same"
                    + " corpus at rung R2′, which keeps the structure of recursive protocols: there 47 of the 74"
                    + " distinct lattices are not distributive, and 50 of the 104 protocols fall in one of them.");

    @ParameterizedTest(name = "{0}")
    @ValueSource(strings = {"en", "de", "pt"})
    @DisplayName("RS-CHECK-04, RS-WALL-05 the seed answers the checks in every language, the values the same in each")
    @SuppressWarnings("unchecked")
    void answersTheSeededChecks(String lang) throws Exception {
        HttpResponse<String> response = get("/api/content/research/checked?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, Object> checked = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, Object>>() {});
        if (lang.equals("en")) {
            assertThat(checked).isEqualTo(EN_CHECKED);
        }
        assertThat(checked.keySet()).isEqualTo(EN_CHECKED.keySet());
        List<Map<String, String>> figures = (List<Map<String, String>>) checked.get("figures");
        assertThat(figures).extracting(figure -> figure.get("value")).isEqualTo(VALUES);
        assertThat(figures).allSatisfy(figure -> assertThat(figure.get("label")).isNotBlank());
        assertThat(List.of(checked.get("heading"), checked.get("rung")))
                .allSatisfy(text -> assertThat((String) text).isNotBlank());
    }

    static Stream<Arguments> tools() {
        return Stream.of(
                Arguments.of("en", "The tool", "Verification tool", "reticulateP on the Software page"),
                Arguments.of("de", "Das Werkzeug", "Verifikationswerkzeug", "reticulateP auf der Software-Seite"),
                Arguments.of("pt", "A ferramenta", "Ferramenta de verificação", "O reticulateP na página de software"));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("tools")
    @DisplayName("RS-TOOL-01, 02, 03 the seed answers the tool in every language, its text the Software row's word for word")
    @SuppressWarnings("unchecked")
    void answersTheSeededTool(String lang, String heading, String kicker, String linkLabel) throws Exception {
        HttpResponse<String> response = get("/api/content/research/tool?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, Object> tool = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, Object>>() {});
        Map<String, Object> work = JsonMapper.builder().build().readValue(
                get("/api/content/software/work?lang=" + lang).body(), new TypeReference<Map<String, Object>>() {});
        Map<String, Object> reticulateP = ((List<Map<String, Object>>) work.get("rows")).stream()
                .filter(row -> "reticulatep".equals(row.get("id"))).findFirst().orElseThrow();
        assertThat(tool).isEqualTo(Map.of(
                "heading", heading,
                "kicker", kicker,
                "title", "reticulateP",
                "text", reticulateP.get("text"),
                "stack", "Python",
                "link", Map.of("label", linkLabel, "href", "/" + lang + "/software")));
    }

    static Stream<Arguments> mores() {
        return Stream.of(
                Arguments.of("en", "More research", "Earlier papers (2007–2010)", "opens in a new tab"),
                Arguments.of("de", "Mehr Forschung", "Frühere Paper (2007–2010)", "öffnet in einem neuen Tab"),
                Arguments.of("pt", "Mais investigação", "Artigos anteriores (2007–2010)", "abre num novo separador"));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("mores")
    @DisplayName("RS-MORE-01, 03 the seed answers the closing row in every language, ResearchGate the same in each")
    void answersTheSeededMore(String lang, String heading, String earlier, String newTab) throws Exception {
        HttpResponse<String> response = get("/api/content/research/more?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, Object>>() {})).isEqualTo(Map.of(
                        "heading", heading,
                        "earlier", earlier,
                        "newTab", newTab,
                        "researchGate", Map.of("label", "ResearchGate",
                                "href", "https://www.researchgate.net/profile/Alexandre-Caldeira")));
    }

    private HttpResponse<String> get(String path) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).build();
        try (HttpClient client = HttpClient.newHttpClient()) {
            return client.send(request, HttpResponse.BodyHandlers.ofString());
        }
    }
}
