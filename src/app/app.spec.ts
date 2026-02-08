import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, reflectComponentType } from '@angular/core';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList);
  });

  it('should create', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(App, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(App);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have app-root selector', () => {
    const mirror = reflectComponentType(App);
    expect(mirror?.selector).toBe('app-root');
  });

  it('should render ZcPage component', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(App, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(App);
    fixture.detectChanges();
    const zcPage = fixture.nativeElement.querySelector('app-zc-page');
    expect(zcPage).toBeTruthy();
  });
});
