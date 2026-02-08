import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionHeader } from './section-header';

describe('SectionHeader', () => {
  let fixture: ComponentFixture<SectionHeader>;
  let component: SectionHeader;

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionHeader);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    component.title = 'My Title';
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toBe('My Title');
  });

  it('should display the subtitle when provided', () => {
    component.title = 'Title';
    component.subtitle = 'A subtitle';
    fixture.detectChanges();
    const subtitle = fixture.nativeElement.querySelector('.subtitle');
    expect(subtitle.textContent).toBe('A subtitle');
  });

  it('should not display subtitle when not provided', () => {
    component.title = 'Title';
    fixture.detectChanges();
    const subtitle = fixture.nativeElement.querySelector('.subtitle');
    expect(subtitle).toBeNull();
  });
});
