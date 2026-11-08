package com.zuacaldeira.content;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
class ContentController {

    private final ContentService content;

    ContentController(ContentService content) {
        this.content = content;
    }

    @GetMapping("/api/content/{page}/{section}")
    ResponseEntity<?> section(
            @PathVariable String page, @PathVariable String section, @RequestParam String lang) {
        if ("home".equals(page)) {
            return ResponseEntity.of(content.find(page, section, lang));
        }
        return content.findSection(page, section, lang)
                .<ResponseEntity<?>>map(body -> ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(body))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
