import { Component, inject } from '@angular/core';
import { RESEARCH_CONTENT } from '../../../content/content';
import { pagePath } from '../../../models/i18n';
import { I18nService } from '../../../services/i18n.service';

/**
 * The Research page's closing row (research-spec.md, "Components"; RS-MORE-nn): the earlier papers on
 * the Writing page, in the page's language and this tab (D22), and ResearchGate, the one profile (Q3),
 * in a new tab that the link names, as the Writing page's outside links do.
 */
@Component({
  selector: 'app-research-more',
  templateUrl: './research-more.html',
  styleUrl: './research-more.css',
})
export class ResearchMore {
  private readonly lang = inject(I18nService).language();
  readonly more = inject(RESEARCH_CONTENT).more[this.lang];
  readonly writing = pagePath(this.lang, 'writing');
}
