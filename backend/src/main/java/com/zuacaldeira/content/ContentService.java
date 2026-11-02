package com.zuacaldeira.content;

import org.springframework.stereotype.Service;

@Service
class ContentService {

    private final HomeHeroRepository heroes;

    ContentService(HomeHeroRepository heroes) {
        this.heroes = heroes;
    }

    HomeHero find(String page, String section, String lang) {
        return heroes.find(lang);
    }
}
