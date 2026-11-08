import { provideTestContent } from '../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Writing } from './writing';
import { I18nService } from '../../services/i18n.service';

describe('Writing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  it('WR-PAGE-03 (D11): should title the page with the full name and its heading', () => {
    TestBed.inject(I18nService).setLanguage('de');
    TestBed.createComponent(Writing).detectChanges();
    expect(TestBed.inject(Title).getTitle()).toBe('Alexandre Zua Caldeira — writing heading de');
  });
});
