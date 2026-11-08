package com.zuacaldeira.content;

import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
class ContentService {

    private static final Set<String> SUPPORTED_LANGUAGES = Set.of("en", "de", "pt");

    private final HomeHeroRepository heroes;
    private final ContentSectionRepository sections;

    ContentService(HomeHeroRepository heroes, ContentSectionRepository sections) {
        this.heroes = heroes;
        this.sections = sections;
    }

    Optional<HomeHero> find(String page, String section, String lang) {
        if (!"home".equals(page) || !"hero".equals(section) || !SUPPORTED_LANGUAGES.contains(lang)) {
            return Optional.empty();
        }
        return heroes.find(lang);
    }

    /** A section of `content_section`, its stored JSON as it is (D11). */
    Optional<String> findSection(String page, String section, String lang) {
        return sections.find(page, section, lang);
    }
}
