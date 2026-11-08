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

  it('SW-PROOF-01: should state the theorem as stored, under its label, then the evidence line', () => {
    const el = render('pt');
    const parts = ['label', 'statement', 'evidence'].map((p) => text(el.querySelector(`.band__${p}`)));
    expect(parts).toEqual(['theorem pt 15 · Name', 'For every S, a statement.', 'evidence pt']);
    expect(el.querySelector('.band__statement')?.getAttribute('translate')).toBe('no');
  });

  it('SW-PROOF-02: should lead on to the paper and to the research page in the same language', () => {
    const buttons = [...render('de').querySelectorAll('.band__actions a')].map(
      (a) => `${text(a)} → ${a.getAttribute('href')}`,
    );
    expect(buttons).toEqual(['read de → /assets/pdfs/paper.pdf', 'all research de → /de/research']);
  });
});
