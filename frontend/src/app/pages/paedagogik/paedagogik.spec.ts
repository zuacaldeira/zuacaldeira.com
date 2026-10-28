import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Paedagogik } from './paedagogik';
import { I18nService } from '../../services/i18n.service';

describe('Paedagogik', () => {
  let component: Paedagogik;

  beforeEach(() => {
    const fixture = TestBed.overrideComponent(Paedagogik, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(Paedagogik);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have translations signal', () => {
    expect(component.t().paedagogik.title).toBeTruthy();
  });

  it('should update translations when language changes', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('de');
    expect(component.t().paedagogik.title).toBe('Pädagogik');
  });
});
