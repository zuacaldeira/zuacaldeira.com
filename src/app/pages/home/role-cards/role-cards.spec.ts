import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RoleCards } from './role-cards';
import { I18nService } from '../../../services/i18n.service';

describe('RoleCards', () => {
  let component: RoleCards;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(RoleCards, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(RoleCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 roles', () => {
    expect(component.roles()).toHaveLength(4);
  });

  it('should map roles with icons and routes', () => {
    const roles = component.roles();
    expect(roles[0]).toEqual(
      expect.objectContaining({ icon: 'science', route: '/research' })
    );
    expect(roles[1]).toEqual(
      expect.objectContaining({ icon: 'code', route: '/work' })
    );
    expect(roles[2]).toEqual(
      expect.objectContaining({ icon: 'school', route: '/paedagogik' })
    );
    expect(roles[3]).toEqual(
      expect.objectContaining({ icon: 'directions_run', route: '/running' })
    );
  });

  it('should include translated titles and descriptions', () => {
    const roles = component.roles();
    for (const role of roles) {
      expect(role.title).toBeTruthy();
      expect(role.description).toBeTruthy();
    }
  });

  it('should update role titles when language changes', () => {
    const i18nService = TestBed.inject(I18nService);
    i18nService.setLanguage('pt');
    const roles = component.roles();
    expect(roles[0].title).toBe('Investigador');
  });
});
