import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { I18nService } from '../../services/i18n.service';
import { LANGUAGE_NAMES, languageLinks } from '../../models/i18n';

/** EN, DE and PT: the same page in each language of the site (SHELL-01, 02, 03). */
@Component({
  selector: 'app-language-links',
  imports: [RouterLink],
  templateUrl: './language-links.html',
})
export class LanguageLinks {
  readonly t = inject(I18nService).translations;
  readonly names = LANGUAGE_NAMES;
  readonly links = languageLinks(inject(Router).url);
}
