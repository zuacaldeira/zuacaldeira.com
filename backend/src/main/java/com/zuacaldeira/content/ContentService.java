package com.zuacaldeira.content;

import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
class ContentService {

    private static final Set<String> SUPPORTED_LANGUAGES = Set.of("en", "de", "pt");

    private final HomeHeroRepository heroes;

    ContentService(HomeHeroRepository heroes) {
        this.heroes = heroes;
    }

    Optional<HomeHero> find(String page, String section, String lang) {
        if (!"home".equals(page) || !"hero".equals(section) || !SUPPORTED_LANGUAGES.contains(lang)) {
            return Optional.empty();
        }
        return heroes.find(lang);
    }
}
