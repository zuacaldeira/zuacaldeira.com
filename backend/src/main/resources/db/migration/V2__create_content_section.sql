-- One JSON object per page, section and language (D11 in docs/examples/software.md).
CREATE TABLE content_section (
    page    VARCHAR(64) NOT NULL,
    section VARCHAR(64) NOT NULL,
    lang    VARCHAR(8)  NOT NULL,
    body    JSON        NOT NULL,
    PRIMARY KEY (page, section, lang)
) DEFAULT CHARSET = utf8mb4;
