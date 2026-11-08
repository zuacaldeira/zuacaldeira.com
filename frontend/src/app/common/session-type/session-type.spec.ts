import { TestBed } from '@angular/core/testing';
import { SessionType } from './session-type';

describe('SessionType', () => {
  it('SW-LEAD-04: should show the type in a <pre> that is never translated, with its caption', () => {
    const fixture = TestBed.createComponent(SessionType);
    fixture.componentRef.setInput('text', 'Run = &{runTest: +{RED: Code,\n  GREEN: Green}}');
    fixture.componentRef.setInput('caption', 'A line of the workflow type, word for word.');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const pre = el.querySelector('pre');
    expect(pre?.getAttribute('translate')).toBe('no');
    expect(pre?.textContent).toBe('Run = &{runTest: +{RED: Code,\n  GREEN: Green}}');
    expect(el.querySelector('figcaption')?.textContent?.trim()).toBe(
      'A line of the workflow type, word for word.',
    );
  });
});
