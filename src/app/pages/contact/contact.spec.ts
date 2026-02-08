import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Contact } from './contact';

describe('Contact', () => {
  let component: Contact;

  beforeEach(() => {
    const fixture = TestBed.overrideComponent(Contact, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(Contact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose social links', () => {
    expect(component.socialLinks.length).toBeGreaterThan(0);
  });

  it('should have translations signal', () => {
    expect(component.t().contact.title).toBeTruthy();
  });
});
