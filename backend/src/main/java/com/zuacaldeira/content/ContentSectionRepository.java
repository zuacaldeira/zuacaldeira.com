package com.zuacaldeira.content;

import java.util.Optional;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** One stored JSON object per page, section and language (D11 in docs/examples/software.md). */
@Repository
class ContentSectionRepository {

    private final JdbcClient jdbc;

    ContentSectionRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    Optional<String> find(String page, String section, String lang) {
        return jdbc.sql("""
                SELECT body
                FROM content_section
                WHERE page = :page AND section = :section AND lang = :lang
                """)
                .param("page", page)
                .param("section", section)
                .param("lang", lang)
                .query(String.class)
                .optional();
    }
}
