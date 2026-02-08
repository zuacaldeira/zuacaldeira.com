import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Work } from './work';
import { I18nService } from '../../services/i18n.service';

describe('Work', () => {
  let component: Work;

  beforeEach(() => {
    const fixture = TestBed.overrideComponent(Work, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(Work);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 projects', () => {
    expect(component.projects()).toHaveLength(4);
  });

  it('should merge translated descriptions into projects', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('pt');
    const projects = component.projects();
    expect(projects[0].description).toContain('Kita Casa Azul');
    expect(projects[0].description).not.toBe(
      'Official website for Kita Casa Azul'
    );
  });

  it('should preserve project titles and tags', () => {
    const projects = component.projects();
    for (const project of projects) {
      expect(project.title).toBeTruthy();
      expect(project.tags.length).toBeGreaterThan(0);
    }
  });
});
