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
  readonly t = inject(I18nService).translations;

  readonly pub = inject(ContentService).publications.find((p) =>
    p.title.includes('Form Lattices'),
  )!;
}
