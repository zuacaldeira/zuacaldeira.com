import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  it('should create', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideRouter([])],
    })
      .overrideComponent(Home, { set: { schemas: [NO_ERRORS_SCHEMA] } })
      .createComponent(Home);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
