import { Component, input } from '@angular/core';

/** A checked session type, shown as written, with its caption (software-spec.md, `SessionType`). */
@Component({
  selector: 'app-session-type',
  template: `
    <figure class="st">
      <pre translate="no">{{ text() }}</pre>
      <figcaption>{{ caption() }}</figcaption>
    </figure>
  `,
  styles: `
    .st {
      margin: 0;
    }
    pre {
      margin: 0;
      padding: var(--zc-space-4);
      background: var(--zc-bg-white);
      border-left: 3px solid var(--zc-azul);
      color: var(--zc-text-heading);
      font-family: var(--zc-font-mono);
      font-size: 0.875rem;
      line-height: 1.6;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    figcaption {
      margin-top: var(--zc-space-2);
      font-family: var(--zc-font-mono);
      font-size: 0.75rem;
      color: var(--zc-text-muted);
    }
    @media (max-width: 479.98px) {
      pre {
        font-size: 0.8125rem;
      }
    }
  `,
})
export class SessionType {
  readonly text = input.required<string>();
  readonly caption = input.required<string>();
}
