import { Component, inject } from '@angular/core';
import { WRITING_CONTENT } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';

/** The Writing page's list: one `<li>` per text, newest first (writing-spec.md, `TextRow`, D14). */
@Component({
  selector: 'app-text-rows',
  templateUrl: './text-rows.html',
  styleUrl: './text-rows.css',
})
export class TextRows {
  private readonly lang = inject(I18nService).language();
  private readonly content = inject(WRITING_CONTENT);
  /** The list's own `<h2>` is the page's name again, visually hidden (writing-spec.md). */
  readonly heading = this.content.head[this.lang].heading;
  readonly texts = this.content.texts[this.lang];
  /** The texts are in English: said, and marked, on the other languages' pages only (D10). */
  readonly englishPage = this.lang === 'en';
}
