package com.zuacaldeira.content;

import static org.assertj.core.api.Assertions.assertThat;

import org.assertj.core.api.InstanceOfAssertFactories;

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

/** The Software page's content in the build's database, from db/seed (docs/examples/software.md). */
@Testcontainers
@ActiveProfiles("seed")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class SoftwareSeedIntegrationTest {

    @Container
    @ServiceConnection
    static final MySQLContainer MYSQL = new MySQLContainer("mysql:8.4");

    @LocalServerPort
    int port;

    static Stream<Arguments> heads() {
        return Stream.of(
                Arguments.of("en", Map.of(
                        "eyebrow", "Selected work",
                        "heading", "Software",
                        "intro", "Software I have built, and how I hold it to its protocol: written down first,"
                                + " checked, then built test-first.")),
                Arguments.of("de", Map.of(
                        "eyebrow", "Ausgewählte Arbeiten",
                        "heading", "Software",
                        "intro", "Software, die ich gebaut habe, und wie ich sie an ihr Protokoll binde: zuerst"
                                + " aufgeschrieben, geprüft, dann testgetrieben gebaut.")),
                Arguments.of("pt", Map.of(
                        "eyebrow", "Trabalhos selecionados",
                        "heading", "Software",
                        "intro", "Software que construí, e como o prendo ao seu protocolo: primeiro escrito,"
                                + " depois verificado, depois construído com os testes primeiro.")));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("heads")
    @DisplayName("SW-HEAD-05 the seed answers the agreed head of the Software page in every language")
    void answersTheSeededHead(String lang, Map<String, String> expected) throws Exception {
        HttpResponse<String> response = get("/api/content/software/head?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, String> head = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, String>>() {});
        assertThat(head).isEqualTo(expected);
        assertThat(head.values()).allSatisfy(text -> assertThat(text).isNotBlank());
    }

    /** The spec's English copy of the lead (D19's shape). */
    private static final Map<String, Object> EN_LEAD = Map.ofEntries(
            Map.entry("kicker", "Case study · AI agents"),
            Map.entry("title", "A monitor that holds a coding agent to its TDD protocol"),
            Map.entry("status", "In use on this site since November 2026"),
            Map.entry("labels", Map.of(
                    "question", "The question",
                    "built", "What I built",
                    "protocol", "The protocol behind it",
                    "live", "The live view",
                    "result", "The result",
                    "stack", "Stack")),
            Map.entry("question", "Does a session type make an AI coding agent’s test-driven work better, and in"
                    + " which mode: in pair with the developer, or in batch on an agreed test list? Better means"
                    + " tests that are meaningful for the work, not coverage."),
            Map.entry("built", "A monitor that watches a TDD agent as it works, through the agent’s hooks, and"
                    + " checks every step against a session type of the TDD workflow: write a test, run it, see"
                    + " it fail for the right reason, make it pass, refactor, commit. Where a type is given, it"
                    + " refuses a step the type does not allow; otherwise it only observes."),
            Map.entry("built2", "It also reports which parts of the target’s own session types the agent’s tests"
                    + " reach: what the software under test must do, failure paths included."),
            Map.entry("protocol", "What the agent does (`&{…}`) is kept apart from the results it receives"
                    + " (`+{…}`). The full workflow type has 56 states and 89 transitions and is a lattice,"
                    + " checked with reticulateP. The variants for sabotage (breaking the code on purpose to"
                    + " show a test bites) and for triangulation are subtypes of it."),
            Map.entry("runCaption", "A line of the workflow type, word for word."),
            Map.entry("live", "`reticulab serve`, a small read-only web app, follows each session live: what is"
                    + " being built, in plain sentences; the agreed test list, N of M done; the target’s"
                    + " coverage; where the agent is in its type; and a slider to replay the steps."),
            Map.entry("result", "In use on this site since November 2026: every element of its header and"
                    + " footer was built test-first by an agent under the monitor, in pair with me."),
            Map.entry("stack", "Python · pytest · Hypothesis · Server-Sent Events · reticulateP"),
            Map.entry("figure", "The Run step: one action of the agent, three results it receives."),
            Map.entry("shotAlt", "The monitor’s live view while the agent built this site’s redirects for old"
                    + " links: on the left, what is being built, in plain sentences, each marked “passed at"
                    + " once” or “failed first, then passed”; on the right, the agent’s map of its 56-state"
                    + " type, at its end."),
            Map.entry("shotCaption", "The live view while the agent built this site’s redirects for old links."));

    @ParameterizedTest(name = "{0}")
    @MethodSource("languagesOfTheLead")
    @DisplayName("SW-LEAD-09 the seed answers the whole lead of the Software page in every language, none empty")
    void answersTheSeededLead(String lang) throws Exception {
        HttpResponse<String> response = get("/api/content/software/lead?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, Object> lead = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, Object>>() {});
        if (lang.equals("en")) {
            assertThat(lead).isEqualTo(EN_LEAD);
        }
        assertThat(lead.keySet()).isEqualTo(EN_LEAD.keySet());
        assertThat(lead.get("labels")).asInstanceOf(InstanceOfAssertFactories.MAP)
                .containsOnlyKeys(((Map<?, ?>) EN_LEAD.get("labels")).keySet())
                .allSatisfy((key, text) -> assertThat((String) text).isNotBlank());
        assertThat(lead).allSatisfy((key, value) -> {
            if (value instanceof String text) {
                assertThat(text).isNotBlank();
            }
        });
    }

    private static final String PAPER = "/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf";

    /** The spec's English "More work" (D26's shape): three rows in the page's order. */
    private static final Map<String, Object> EN_WORK = Map.of(
            "heading", "More work",
            "rows", List.of(
                    Map.of("id", "reticulatep",
                            "kicker", "Verification tool",
                            "title", "reticulateP",
                            "text", "Builds the state space of a session type and checks that it forms a lattice."
                                    + " It turned the ICE 2026 paper’s 108 benchmark protocols into lattices, is one"
                                    + " of the paper’s two independent tool implementations, and checks every session"
                                    + " type on this site.",
                            "stack", "Python",
                            "links", List.of(Map.of("label", "Read the paper (PDF)", "href", PAPER))),
                    Map.of("id", "kita-dienstplan",
                            "kicker", "Web application",
                            "title", "Kita Dienstplan",
                            "text", "Shift planning for the team of Kita Casa Azul, a bilingual Portuguese-German"
                                    + " kindergarten in Berlin: an Angular front end and a Spring Boot back end, with"
                                    + " role-based access.",
                            "stack", "Angular · Spring Boot · Java · PostgreSQL",
                            "links", List.of(Map.of("label", "Repository",
                                    "href", "https://github.com/zuacaldeira/kita-dienstplan"))),
                    Map.of("id", "casa-azul",
                            "kicker", "Website",
                            "title", "Casa Azul website",
                            "text", "The website of Kita Casa Azul, the bilingual Portuguese-German kindergarten in"
                                    + " Berlin, prerendered with Angular so every page loads as plain HTML.",
                            "stack", "Angular · Angular Material · SSR prerendering · TypeScript",
                            "links", List.of(
                                    Map.of("label", "casa-azul-berlin.de", "href", "https://casa-azul-berlin.de"),
                                    Map.of("label", "Repository",
                                            "href", "https://github.com/zuacaldeira/ca-website")))));

    @ParameterizedTest(name = "{0}")
    @MethodSource("languagesOfTheLead")
    @DisplayName("SW-WORK-06 the seed answers the three pieces of More work in every language, none empty")
    @SuppressWarnings("unchecked")
    void answersTheSeededWork(String lang) throws Exception {
        HttpResponse<String> response = get("/api/content/software/work?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, Object> work = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, Object>>() {});
        if (lang.equals("en")) {
            assertThat(work).isEqualTo(EN_WORK);
        }
        assertThat((String) work.get("heading")).isNotBlank();
        List<Map<String, Object>> rows = (List<Map<String, Object>>) work.get("rows");
        List<Map<String, Object>> enRows = (List<Map<String, Object>>) EN_WORK.get("rows");
        // The same pieces in the same order; names (but Casa Azul's), stacks and targets untranslated.
        assertThat(rows).extracting(row -> row.get("id")).isEqualTo(enRows.stream().map(r -> r.get("id")).toList());
        assertThat(rows).extracting(row -> row.get("stack")).isEqualTo(enRows.stream().map(r -> r.get("stack")).toList());
        assertThat(rows.subList(0, 2)).extracting(row -> row.get("title")).containsExactly("reticulateP", "Kita Dienstplan");
        assertThat(rows).extracting(row -> ((List<Map<String, String>>) row.get("links")).stream()
                        .map(link -> link.get("href")).toList())
                .isEqualTo(enRows.stream().map(r -> ((List<Map<String, String>>) r.get("links")).stream()
                        .map(link -> link.get("href")).toList()).toList());
        assertThat(rows).allSatisfy(row -> {
            assertThat((String) row.get("kicker")).isNotBlank();
            assertThat((String) row.get("title")).isNotBlank();
            assertThat((String) row.get("text")).isNotBlank();
            assertThat((List<Map<String, String>>) row.get("links"))
                    .allSatisfy(link -> assertThat(link.get("label")).isNotBlank());
        });
    }

    /** The spec's English "How I work" (D28's shape). */
    private static final Map<String, Object> EN_HOW = Map.of(
            "heading", "How I work",
            "steps", List.of(
                    Map.of("title", "Protocol first",
                            "text", "The behaviour is agreed as examples and written as a session type before any"
                                    + " code exists."),
                    Map.of("title", "Test-first, one step at a time",
                            "text", "Each test is seen to fail for the right reason, then made to pass; then the"
                                    + " code is tidied and committed."),
                    Map.of("title", "Every forbidden path shown red",
                            "text", "What the protocol rules out gets a test too, and each such test is broken once"
                                    + " on purpose, to prove it bites.")),
            "caption", "From this site, as a checked global type: the page gives the visitor its links, the"
                    + " visitor asks nginx, and nginx answers 200. There is no redirect branch (SHELL-04).");

    @ParameterizedTest(name = "{0}")
    @MethodSource("languagesOfTheLead")
    @DisplayName("SW-HOW-04 the seed answers How I work in every language: three steps and a caption, none empty")
    @SuppressWarnings("unchecked")
    void answersTheSeededHow(String lang) throws Exception {
        HttpResponse<String> response = get("/api/content/software/how?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, Object> how = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, Object>>() {});
        if (lang.equals("en")) {
            assertThat(how).isEqualTo(EN_HOW);
        }
        assertThat(how.keySet()).isEqualTo(EN_HOW.keySet());
        assertThat((String) how.get("heading")).isNotBlank();
        assertThat((String) how.get("caption")).isNotBlank();
        assertThat((List<Map<String, String>>) how.get("steps")).hasSize(3).allSatisfy(step -> {
            assertThat(step.get("title")).isNotBlank();
            assertThat(step.get("text")).isNotBlank();
        });
    }

    static Stream<String> languagesOfTheLead() {
        return Stream.of("en", "de", "pt");
    }

    private HttpResponse<String> get(String path) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).build();
        try (HttpClient client = HttpClient.newHttpClient()) {
            return client.send(request, HttpResponse.BodyHandlers.ofString());
        }
    }
}
