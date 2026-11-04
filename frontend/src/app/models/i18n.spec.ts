import { Language, LANGUAGES, languageLinks, pagePath } from './i18n';

describe('languageLinks', () => {
  it('SHELL-02: leads to the same page in each language, the page’s own current, /de/research', () => {
    expect(languageLinks('/de/research')).toEqual([
      { lang: 'en', href: '/en/research', current: false },
      { lang: 'de', href: '/de/research', current: true },
      { lang: 'pt', href: '/pt/research', current: false },
    ]);
  });

  it('SHELL-02: treats the site root as the English home, /', () => {
    expect(languageLinks('/')).toEqual([
      { lang: 'en', href: '/en/home', current: true },
      { lang: 'de', href: '/de/home', current: false },
      { lang: 'pt', href: '/pt/home', current: false },
    ]);
  });

  it('SHELL-02: drops the fragment the skip link adds, /de/research#main-content', () => {
    expect(languageLinks('/de/research#main-content').map((link) => link.href)).toEqual([
      '/en/research',
      '/de/research',
      '/pt/research',
    ]);
  });

  it('SHELL-09: leads the 404 page to the three home pages, none current, /404', () => {
    expect(languageLinks('/404')).toEqual([
      { lang: 'en', href: '/en/home', current: false },
      { lang: 'de', href: '/de/home', current: false },
      { lang: 'pt', href: '/pt/home', current: false },
    ]);
  });
});

describe('pagePath', () => {
  it('SHELL-04: puts the language in front of the page, /de/about', () => {
    expect(pagePath('de', 'about')).toBe('/de/about');
  });

  it('SHELL-04: does the same for any language and page, /pt/home', () => {
    expect(pagePath('pt', 'home')).toBe('/pt/home');
  });
});

describe('the languages of the site', () => {
  it('I18N-02: are English, German and Portuguese, in that order', () => {
    expect(LANGUAGES).toEqual(['en', 'de', 'pt']);
  });

  it('I18N-02: do not include French, which the compiler refuses', () => {
    // @ts-expect-error French is not a language of the site.
    const french: Language = 'fr';
    expect(LANGUAGES).not.toContain(french);
  });
});
