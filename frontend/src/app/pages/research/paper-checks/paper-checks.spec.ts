import { provideTestContent } from '../../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { PaperChecks } from './paper-checks';
import { I18nService } from '../../../services/i18n.service';

describe('PaperChecks', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  const show = (lang: 'en' | 'de' | 'pt'): HTMLElement => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(PaperChecks);
    fixture.detectChanges();
    return fixture.nativeElement;
  };
  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

  it('RS-CHECK-01, 02, 05 (D26): should show the four figures, then the evidence, and nothing after it', () => {
    const checks = show('de');
    const dl = checks.querySelector('dl');
    expect({
      heading: text(checks.querySelector('h2')),
      figures: [...(dl?.querySelectorAll('dt') ?? [])].map((dt) => ({
        value: text(dt),
        translate: dt.getAttribute('translate'),
        label: text(dt.nextElementSibling),
      })),
      after: [...checks.querySelectorAll('dl ~ p')].map((p) => text(p)),
    }).toEqual({
      heading: 'checked heading de',
      figures: ['108', '93', '15', 'Lean 4'].map((value) => ({
        value,
        translate: 'no',
        label: `label ${value} de`,
      })),
      after: ['evidence de'],
    });
  });
});
