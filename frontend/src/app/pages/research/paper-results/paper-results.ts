import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RESEARCH_CONTENT, SHARED_CONTENT } from '../../../content/content';
import { I18nService } from '../../../services/i18n.service';

/**
 * What the paper proves, on the theorem band (research-spec.md, "Components"; RS-RES-nn): the
 * four statements of `shared/paper` (D3), the theorem first, all open; their names and texts as
 * published, their labels in the page's language.
 */
@Component({
  selector: 'app-paper-results',
  imports: [NgTemplateOutlet],
  templateUrl: './paper-results.html',
  styleUrl: './paper-results.css',
})
export class PaperResults {
  private readonly lang = inject(I18nService).language();
  readonly english = this.lang === 'en';
  readonly heading = inject(RESEARCH_CONTENT).results[this.lang].heading;
  private readonly paper = inject(SHARED_CONTENT).paper[this.lang];
  readonly theorem = this.paper.statements.find((s) => s.kind === 'theorem');
  readonly others = this.paper.statements.filter((s) => s.kind !== 'theorem');

  /** The kind's word in the page's language: Satz, Definição, … */
  kindWord(kind: string): string {
    const { theorem, definition, lemma, proposition } = this.paper;
    return ({ theorem, definition, lemma, proposition } as Record<string, string>)[kind] ?? kind;
  }
}
