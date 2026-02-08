import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FacharbeitenList } from './facharbeiten-list';
import { I18nService } from '../../../services/i18n.service';

describe('FacharbeitenList', () => {
  let component: FacharbeitenList;

  beforeEach(() => {
    const fixture = TestBed.overrideComponent(FacharbeitenList, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(FacharbeitenList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have facharbeiten with translated descriptions', () => {
    const items = component.facharbeiten();
    expect(items.length).toBeGreaterThanOrEqual(1);
    for (const item of items) {
      expect(item.title).toBeTruthy();
      expect(item.description).toBeTruthy();
    }
  });

  it('should update descriptions when language changes', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('en');
    const enDescription = component.facharbeiten()[0].description;
    i18nService.setLanguage('pt');
    const ptDescription = component.facharbeiten()[0].description;
    expect(ptDescription).not.toBe(enDescription);
  });
});
