import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { I18nService } from '../../../services/i18n.service';
import { ContentService } from '../../../services/content.service';

/**
 * Four statements from the lattice paper, set in display type — the wall behind the
 * hero, speaking. Statement texts are quoted from the paper and stay in English;
 * only the labels (Definition/Satz/Théorème…) are translated.
 */
@Component({
  selector: 'app-paper-statements',
  imports: [MatButtonModule],
  templateUrl: './paper-statements.html',
  styleUrl: './paper-statements.css',
})
export class PaperStatements {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.translations;
  /** The page's language: the paper's title is marked English where the page is not (HOME-PAPER-10). */
  readonly language = this.i18n.language;

  readonly pub = inject(ContentService).publications.find((p) =>
    p.title.includes('Form Lattices'),
  )!;
}
