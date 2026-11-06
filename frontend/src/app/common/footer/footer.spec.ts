import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';
import { I18nService } from '../../services/i18n.service';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(Footer, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

  const footerText = (selector: string) =>
    (fixture.nativeElement as HTMLElement)
      .querySelector(`footer ${selector}`)
      ?.textContent?.replace(/\s+/g, ' ')
      .trim();

  it('SHELL-07: ends with "⊥ end · hier endet jedes Protokoll" on a German page', async () => {
    TestBed.inject(I18nService).setLanguage('de');
    await fixture.whenStable();
    expect(footerText('p')).toBe('⊥ end · hier endet jedes Protokoll');
  });

  it('SHELL-07 (D29): hides the end line\'s ⊥ from screen readers, and only that', async () => {
    await fixture.whenStable();
    const hidden = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('footer [aria-hidden="true"]'),
    ].map((el) => el.textContent?.trim());
    expect(hidden).toEqual(['⊥']);
  });

  it('SHELL-07: invites with the heading "Let’s talk about your system." on an English page', async () => {
    TestBed.inject(I18nService).setLanguage('en');
    await fixture.whenStable();
    expect(footerText('h2')).toBe('Let’s talk about your system.');
  });

  it('SHELL-07: says after the heading what work Zua is open to, on a Portuguese page', async () => {
    TestBed.inject(I18nService).setLanguage('pt');
    await fixture.whenStable();
    expect(footerText('h2 + p')).toBe(
      'Aberto a funções em engenharia de software e investigação, e a colaborações em protocolos, verificação e sistemas de agentes.',
    );
  });

  it('SHELL-07: has one mail link, showing the address it writes to', async () => {
    await fixture.whenStable();
    const mail = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('footer a[href^="mailto:"]'),
    ].map((a) => [a.textContent?.trim(), a.getAttribute('href')]);
    expect(mail).toEqual([['hello@zuacaldeira.com', 'mailto:hello@zuacaldeira.com']]);
  });

  it('SHELL-07 (D26, D28): links to GitHub, LinkedIn and the CV, "Lebenslauf (PDF)" on a German page', async () => {
    TestBed.inject(I18nService).setLanguage('de');
    await fixture.whenStable();
    const profiles = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll(
        'footer a[href^="https:"], footer a[href^="/assets/"]',
      ),
    ].map((a) => [a.textContent?.trim(), a.getAttribute('href')]);
    expect(profiles).toEqual([
      ['GitHub', 'https://github.com/zuacaldeira'],
      ['LinkedIn', 'https://linkedin.com/in/zuacaldeira'],
      ['Lebenslauf (PDF)', '/assets/cv/alexandre-zua-caldeira-cv.pdf'],
    ]);
  });

  it('SHELL-07 (D25): has no page menu, its only links into the site are the languages', async () => {
    TestBed.inject(I18nService).setLanguage('de');
    await fixture.whenStable();
    const pages = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('footer a[href^="/"]:not([hreflang])'),
    ]
      .map((a) => a.getAttribute('href'))
      .filter((href) => !href?.startsWith('/assets/'));
    expect(pages).toEqual([]);
  });

  it('SHELL-03: lists the languages written out, English, Deutsch, Português', async () => {
    await fixture.whenStable();
    const names = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('footer app-language-links a'),
    ].map((a) => a.textContent?.trim());
    expect(names).toEqual(['English', 'Deutsch', 'Português']);
  });
});
