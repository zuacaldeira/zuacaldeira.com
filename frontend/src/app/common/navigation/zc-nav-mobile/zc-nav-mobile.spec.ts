import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ZcNavMobile } from './zc-nav-mobile';
import { MatSidenav } from '@angular/material/sidenav';
import { I18nService } from '../../../services/i18n.service';

describe('ZcNavMobile', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
  });

  it('SHELL-04: links the logo to /de/home on a German page', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } });
    TestBed.inject(I18nService).setLanguage('de');
    const fixture = TestBed.createComponent(ZcNavMobile);
    await fixture.whenStable();
    const logo = (fixture.nativeElement as HTMLElement).querySelector('a.logo');
    expect(logo?.getAttribute('href')).toBe('/de/home');
  });

  it('should create', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(ZcNavMobile);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have translations signal', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(ZcNavMobile);
    fixture.detectChanges();
    expect(fixture.componentInstance.t()).toBeTruthy();
  });

  it('should call toggle on the drawer', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(ZcNavMobile, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(ZcNavMobile);
    fixture.detectChanges();
    const mockDrawer = { toggle: vi.fn() } as unknown as MatSidenav;
    fixture.componentInstance.toggle(mockDrawer);
    expect(mockDrawer.toggle).toHaveBeenCalled();
  });
});
