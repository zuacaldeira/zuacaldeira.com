CREATE TABLE home_hero (
    lang            VARCHAR(8)   NOT NULL PRIMARY KEY,
    headline        VARCHAR(500) NOT NULL,
    lede            VARCHAR(500) NOT NULL,
    work_cta        VARCHAR(500) NOT NULL,
    cv_cta          VARCHAR(500) NOT NULL,
    paper_cta       VARCHAR(500) NOT NULL,
    lattice_label   VARCHAR(500) NOT NULL,
    lattice_caption VARCHAR(500) NOT NULL
) DEFAULT CHARSET = utf8mb4;
