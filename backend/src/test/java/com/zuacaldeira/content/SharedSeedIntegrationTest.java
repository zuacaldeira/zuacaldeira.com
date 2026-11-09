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

/** Text shared by several pages, in the build's database, from db/seed (D30 in docs/examples/software.md). */
@Testcontainers
@ActiveProfiles("seed")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class SharedSeedIntegrationTest {

    @Container
    @ServiceConnection
    static final MySQLContainer MYSQL = new MySQLContainer("mysql:8.4");

    @LocalServerPort
    int port;

    /**
     * The paper's four statements, in the research spec's order (D3 in docs/examples/research.md,
     * which replaces D31 in software.md); the same in every language: notation is never translated.
     */
    private static final List<Map<String, Object>> STATEMENTS = List.of(
            Map.of("kind", "theorem", "number", 15, "name", "Reticulate Theorem",
                    "text", "For every well-formed session type S, ℒ(S)/≡ is a bounded lattice."),
            Map.of("kind", "definition", "number", 6, "name", "SCC quotient",
                    "text", "The SCC quotient ℒ(S)/≡ identifies mutually reachable states, collapsing each recursion"
                            + " cycle to one class. It is ordered by [s₁] ≤ [s₂] iff s₂ ↠ s₁: a state is smaller when"
                            + " less of the protocol remains, so execution descends from q⊤ to q⊥."),
            Map.of("kind", "lemma", "number", 8, "name", "End",
                    "text", "ℒ(end)/≡ is a bounded lattice."),
            Map.of("kind", "proposition", "number", 18, "name", "Duality isomorphism",
                    "text", "For every well-formed session type S, there is a bounded-lattice isomorphism"
                            + " ℒ(S)/≡ ≅ ℒ(dual(S))/≡."));

    /** HOME-PAPER-09's fields in English (home.md: HOME-PAPER-01 to 08). */
    private static final Map<String, Object> EN_PAPER = Map.ofEntries(
            Map.entry("eyebrow", "From the paper"),
            Map.entry("paperTitle", "Session Type State Spaces Form Lattices"),
            Map.entry("year", 2026),
            Map.entry("theorem", "Theorem"),
            Map.entry("definition", "Definition"),
            Map.entry("lemma", "Lemma"),
            Map.entry("proposition", "Proposition"),
            Map.entry("evidence", "Checked on 108 benchmark protocols from networking, databases, distributed"
                    + " systems and AI. Mechanised in Lean 4, with two independent tool implementations."),
            Map.entry("read", "Read the paper (PDF)"),
            Map.entry("allResearch", "All research"),
            Map.entry("more", "Definition 6, Lemma 8, Proposition 18"),
            Map.entry("pdfUrl", "/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf"),
            Map.entry("statements", STATEMENTS));

    static Stream<String> languages() {
        return Stream.of("en", "de", "pt");
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("languages")
    @DisplayName("SW-PROOF-03, RS-RES-05 the seed answers the paper's shared labels in every language, the four statements the same")
    void answersTheSeededPaper(String lang) throws Exception {
        HttpResponse<String> response = get("/api/content/shared/paper?lang=" + lang);

        assertThat(response.statusCode()).isEqualTo(200);
        Map<String, Object> paper = JsonMapper.builder().build().readValue(response.body(),
                new TypeReference<Map<String, Object>>() {});
        if (lang.equals("en")) {
            assertThat(paper).isEqualTo(EN_PAPER);
        }
        assertThat(paper.keySet()).isEqualTo(EN_PAPER.keySet());
        for (String same : List.of("paperTitle", "year", "pdfUrl", "statements")) {
            assertThat(paper.get(same)).as(same).isEqualTo(EN_PAPER.get(same));
        }
        assertThat(paper).allSatisfy((key, value) -> {
            if (value instanceof String text) {
                assertThat(text).as(key).isNotBlank();
            }
        });
    }

    private HttpResponse<String> get(String path) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).build();
        try (HttpClient client = HttpClient.newHttpClient()) {
            return client.send(request, HttpResponse.BodyHandlers.ofString());
        }
    }
}
