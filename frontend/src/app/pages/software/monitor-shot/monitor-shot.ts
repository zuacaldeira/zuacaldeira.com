import { Component, input } from '@angular/core';

/**
 * The live view's screenshot, light or dark to match the page (software-spec.md, `MonitorShot`).
 * Both images are in the page; the CSS shows the one for the theme, and the other, lazy and not
 * displayed, is never downloaded (D24). The image's alt text names its link.
 */
@Component({
  selector: 'app-monitor-shot',
  template: `
    <figure class="sw-shot">
      @for (mode of modes; track mode) {
        <a class="sw-shot__link sw-shot__link--{{ mode }}" [href]="file(mode)">
          <img [src]="file(mode)" [alt]="alt()" width="1440" height="900" loading="lazy" />
        </a>
      }
      <figcaption>{{ caption() }}</figcaption>
    </figure>
  `,
  styles: `
    .sw-shot {
      margin: 0;
    }
    .sw-shot__link {
      display: block;
    }
    .sw-shot__link--dark,
    :host-context(html.dark-theme) .sw-shot__link--light {
      display: none;
    }
    :host-context(html.dark-theme) .sw-shot__link--dark {
      display: block;
    }
    img {
      display: block;
      width: 100%;
      height: auto;
      border: 1px solid var(--zc-border-light);
    }
    figcaption {
      margin-top: var(--zc-space-2);
      font-family: var(--zc-font-mono);
      font-size: 0.75rem;
      color: var(--zc-text-muted);
    }
  `,
})
export class MonitorShot {
  readonly alt = input.required<string>();
  readonly caption = input.required<string>();
  readonly modes = ['light', 'dark'] as const;
  readonly file = (mode: 'light' | 'dark') => `/assets/software/reticulab-live-${mode}.png`;
}
