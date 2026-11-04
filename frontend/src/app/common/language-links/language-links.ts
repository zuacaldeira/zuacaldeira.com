import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { I18nService } from '../../services/i18n.service';
import { LANGUAGE_NAMES, languageLinks } from '../../models/i18n';

/** EN, DE and PT: the same page in each language of the site (SHELL-01, 02, 03). */
@Component({
  selector: 'app-language-links',
  imports: [RouterLink],
  templateUrl: './language-links.html',
})
export class LanguageLinks {
  /** The bar's codes (EN DE PT), or the names written out for the footer. */
  readonly form = input<'codes' | 'names'>('codes');

  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  readonly t = inject(I18nService).translations;
  readonly names = LANGUAGE_NAMES;
  readonly links = computed(() => languageLinks(this.url()));
}
