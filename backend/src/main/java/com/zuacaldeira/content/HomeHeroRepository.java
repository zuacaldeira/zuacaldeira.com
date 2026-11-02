package com.zuacaldeira.content;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
class HomeHeroRepository {

    private final JdbcClient jdbc;

    HomeHeroRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    HomeHero find(String lang) {
        return jdbc.sql("""
                SELECT headline, lede, work_cta, cv_cta, paper_cta, lattice_label, lattice_caption
                FROM home_hero
                WHERE lang = :lang
                """)
                .param("lang", lang)
                .query(HomeHero.class)
                .single();
    }
}
