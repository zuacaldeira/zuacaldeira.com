import { provideTestContent } from '../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TheoremBand } from './theorem-band';
import { I18nService } from '../../services/i18n.service';

describe('TheoremBand', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideTestContent()] });
  });

  const render = (lang: 'en' | 'de' | 'pt'): HTMLElement => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(TheoremBand);
    fixture.componentRef.setInput('kicker', `proof kicker ${lang}`);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

  it('SW-PROOF-01: should name the paper in the page language, with the kicker it is given', () => {
    const el = render('de');
    expect(text(el.querySelector('.band__paper'))).toBe('eyebrow de — Paper Title · ICE 2026');
    expect(text(el.querySelector('.band__kicker'))).toBe('proof kicker de');
  });
});
