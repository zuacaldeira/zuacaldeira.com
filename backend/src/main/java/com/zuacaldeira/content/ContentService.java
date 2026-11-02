package com.zuacaldeira.content;

import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
class ContentService {

    private final HomeHeroRepository heroes;

    ContentService(HomeHeroRepository heroes) {
        this.heroes = heroes;
    }

    Optional<HomeHero> find(String page, String section, String lang) {
        if (!"home".equals(page) || !"hero".equals(section)) {
            return Optional.empty();
        }
        return heroes.find(lang);
    }
}
