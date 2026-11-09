import { Component, inject } from '@angular/core';
import { RESEARCH_CONTENT, SHARED_CONTENT } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';

/**
 * The Research page's paper card (research-spec.md, "Components"; RS-PAPER-nn): its labels from
 * `research/paper`, the paper's title, year and PDF from `shared/paper` (D2). Title, author, venue
 * and abstract are never translated; on de and pt they are marked English (R2).
 */
@Component({
  selector: 'app-paper-card',
  templateUrl: './paper-card.html',
})
export class PaperCard {
  private readonly lang = inject(I18nService).language();
  readonly english = this.lang === 'en';
  readonly paper = inject(RESEARCH_CONTENT).paper[this.lang];
  readonly shared = inject(SHARED_CONTENT).paper[this.lang];
}
