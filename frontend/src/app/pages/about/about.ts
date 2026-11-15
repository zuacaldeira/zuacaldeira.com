import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ABOUT_CONTENT } from '../../content/content';
import { pagePath } from '../../models/i18n';
import { I18nService } from '../../services/i18n.service';
import { PageHead } from '../../common/page-head/page-head';

/**
 * The About page: Zua's CV told as a story along the route (docs/examples/about.md; build spec
 * docs/mockups/about/about-spec.md). Its head is the shared head, as on Software, Writing and
 * Research; beside the chapters, the route.
 */
@Component({
  selector: 'app-about',
  imports: [PageHead],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  private readonly lang = inject(I18nService).language();
  private readonly content = inject(ABOUT_CONTENT);
  readonly head = this.content.head[this.lang];
  readonly route = this.content.route[this.lang];

  /** Each stop with its link, `/l/about#{id}` (D8: the site's `<base href="/">`), and its number. */
  readonly stops = this.route.stops.map((stop, i) => ({
    ...stop,
    href: `${pagePath(this.lang, 'about')}#${stop.id}`,
    chapter: this.route.chapter.replace('{n}', String(i + 1)),
  }));

  constructor() {
    // The name is not translated, so it stays here, not in the content (D11 in writing.md).
    inject(Title).setTitle(`Alexandre Zua Caldeira — ${this.head.heading}`);
  }
}
