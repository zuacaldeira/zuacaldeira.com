import { provideTestContent } from '../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Software } from './software';
import { I18nService } from '../../services/i18n.service';

describe('Software', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  it('SW-PAGE-03 (D9, D11): should title the page with the full name and its heading', () => {
    TestBed.inject(I18nService).setLanguage('de');
    TestBed.createComponent(Software).detectChanges();
    expect(TestBed.inject(Title).getTitle()).toBe('Alexandre Zua Caldeira — heading de');
  });

  it('SW-HEAD-02: should open with the eyebrow, the one <h1> and the intro in the page language', () => {
    TestBed.inject(I18nService).setLanguage('de');
    const fixture = TestBed.createComponent(Software);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    const texts = (selector: string) =>
      [...page.querySelectorAll(selector)].map((el) => el.textContent?.trim());
    expect(texts('.sw-head__eyebrow')).toEqual(['eyebrow de']);
    expect(texts('h1')).toEqual(['heading de']);
    expect(texts('.sw-head__intro')).toEqual(['intro de']);
  });
});
