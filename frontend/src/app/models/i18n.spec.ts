import { Language, LANGUAGES, pagePath } from './i18n';

describe('pagePath', () => {
  it('SHELL-04: puts the language in front of the page, /de/about', () => {
    expect(pagePath('de', 'about')).toBe('/de/about');
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
