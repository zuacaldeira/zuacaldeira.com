import { provideTestContent } from '../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { Research } from './research';
import { I18nService } from '../../services/i18n.service';

describe('Research', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  it('RS-HEAD-02, RS-PAGE-07: should open with the eyebrow, the one <h1> and the intro in the page language, and show nothing else', () => {
    TestBed.inject(I18nService).setLanguage('de');
    const fixture = TestBed.createComponent(Research);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    const texts = (selector: string) =>
      [...page.querySelectorAll(selector)].map((el) => el.textContent?.trim());
    expect(texts('.page-head__eyebrow')).toEqual(['research eyebrow de']);
    expect(texts('h1')).toEqual(['research heading de']);
    expect(texts('.page-head__intro')).toEqual(['research intro de']);
    expect([...page.children].map((el) => el.tagName)).toEqual(['APP-PAGE-HEAD']);
  });
});
