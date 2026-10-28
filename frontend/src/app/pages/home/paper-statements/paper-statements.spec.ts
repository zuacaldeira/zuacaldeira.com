import { TestBed } from '@angular/core/testing';
import { PaperStatements } from './paper-statements';
import { I18nService } from '../../../services/i18n.service';

describe('PaperStatements', () => {
  let component: PaperStatements;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // localStorage leaks between test files — pin the language to English.
    TestBed.inject(I18nService).setLanguage('en');
    const fixture = TestBed.createComponent(PaperStatements);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it('should cite the lattice paper in the eyebrow', () => {
    expect(el.querySelector('.paper__eyebrow')?.textContent).toContain(
      'Session Type State Spaces Form Lattices',
    );
  });

  it('should display the Reticulate Theorem as the centerpiece', () => {
    const display = el.querySelector('.paper__statement--display');
    expect(display?.textContent).toContain('bounded lattice');
    expect(el.querySelector('.paper__theorem .paper__kind')?.textContent).toContain('Theorem 15');
  });

  it('should quote Theorem 15 exactly as the camera-ready states it', () => {
    const text = el.querySelector('.paper__statement--display')?.textContent?.replace(/\s+/g, ' ');
    expect(text?.trim()).toBe('For every well-formed session type S, ℒ(S)/≡ is a bounded lattice.');
    // An earlier draft over-claimed the scope; the camera-ready dropped the qualifier
    // because named equations yield only a bounded *partial* lattice in general.
    expect(text).not.toContain('six constructors');
    expect(text).not.toContain('mutual recursion');
  });

  it('should show the definition, lemma, and proposition cards', () => {
    const kinds = Array.from(el.querySelectorAll('.paper__card .paper__kind')).map(
      (k) => k.textContent ?? '',
    );
    expect(kinds.length).toBe(3);
    expect(kinds[0]).toContain('Definition 6');
    expect(kinds[1]).toContain('Lemma 8');
    expect(kinds[2]).toContain('Proposition 18');
  });

  it('should link to the paper PDF', () => {
    const link = el.querySelector('a.paper__link');
    expect(link?.getAttribute('href')).toBe(component.pub.url);
    expect(component.pub.url).toContain('.pdf');
    expect(link?.getAttribute('rel')).toContain('noopener');
  });
});
