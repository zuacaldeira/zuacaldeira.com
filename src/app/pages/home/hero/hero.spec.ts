import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Hero } from './hero';
import { I18nService } from '../../../services/i18n.service';

describe('Hero', () => {
  let component: Hero;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(Hero, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(Hero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have translations signal', () => {
    expect(component.t().hero.greeting).toBeTruthy();
  });

  it('should update translations when language changes', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('pt');
    expect(component.t().hero.greeting).toBe('Olá, eu sou');
  });
});
