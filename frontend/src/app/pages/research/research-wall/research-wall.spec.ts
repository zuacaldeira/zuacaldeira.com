import { provideTestContent } from '../../../content/content.testing';
import { TestBed } from '@angular/core/testing';
import { ResearchWall } from './research-wall';
import { I18nService } from '../../../services/i18n.service';

describe('ResearchWall', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTestContent()] });
  });

  const show = (lang: 'en' | 'de' | 'pt') => {
    TestBed.inject(I18nService).setLanguage(lang);
    const fixture = TestBed.createComponent(ResearchWall);
    fixture.detectChanges();
    return { fixture, wall: fixture.nativeElement as HTMLElement };
  };

  it('RS-WALL-02: should label the wall as one image and caption it, in the page language', () => {
    const { wall } = show('de');
    const svg = wall.querySelector('figure svg');
    expect({
      role: svg?.getAttribute('role'),
      label: svg?.getAttribute('aria-label'),
      caption: wall.querySelector('figure figcaption')?.textContent?.trim(),
    }).toEqual({ role: 'img', label: 'wall label de', caption: 'wall caption de' });
  });
});
