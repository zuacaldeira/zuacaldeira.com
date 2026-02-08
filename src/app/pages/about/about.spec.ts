import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { About } from './about';
import { I18nService } from '../../services/i18n.service';

describe('About', () => {
  let component: About;

  beforeEach(() => {
    const fixture = TestBed.overrideComponent(About, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(About);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have translations signal', () => {
    expect(component.t().about.title).toBeTruthy();
  });

  it('should update translations when language changes', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('de');
    expect(component.t().about.title).toBe('Über mich');
  });
});
