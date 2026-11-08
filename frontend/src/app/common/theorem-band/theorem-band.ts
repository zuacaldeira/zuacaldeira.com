import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SHARED_CONTENT } from '../../content/content';
import { pagePath } from '../../models/i18n';
import { I18nService } from '../../services/i18n.service';

/**
 * The theorem band: Theorem 15 from the ICE 2026 paper, its evidence and two buttons. Shared by the
 * Software page's proof band now and the home band later (D14, D30); its labels are `shared/paper`.
 */
@Component({
  selector: 'app-theorem-band',
  imports: [RouterLink],
  templateUrl: './theorem-band.html',
  styleUrl: './theorem-band.css',
})
export class TheoremBand {
  readonly kicker = input.required<string>();
  private readonly lang = inject(I18nService).language();
  readonly paper = inject(SHARED_CONTENT).paper[this.lang];
  /** The band's statement: the paper's theorem (Theorem 15, the Reticulate Theorem). */
  readonly theorem = this.paper.statements.find((s) => s.kind === 'theorem');
  /** All research, in the page's language (SHELL-04). */
  readonly research = pagePath(this.lang, 'research');
}
