import { TestBed } from '@angular/core/testing';
import { LatticeWall } from './lattice-wall';

describe('LatticeWall', () => {
  let el: HTMLElement;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({}).createComponent(LatticeWall);
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it('should render one accessible svg wall', () => {
    const svg = el.querySelector('svg.wall');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.querySelector('title')?.textContent).toContain('108');
  });

  it('should draw all 41 lattice tiles', () => {
    expect(el.querySelectorAll('svg.wall > g.t').length).toBe(41);
  });

  it('should mark the 15 non-distributive lattices', () => {
    expect(el.querySelectorAll('svg.wall > g.nd').length).toBe(15);
  });
});
