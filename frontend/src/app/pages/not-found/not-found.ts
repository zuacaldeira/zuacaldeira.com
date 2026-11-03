import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../services/i18n.service';

/** The one 404 page for every unknown path, in English (D9). */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <h1>⊥ {{ t().notFound.title }}</h1>
    <p>{{ t().notFound.text }}</p>
    <a routerLink="/en/home">{{ t().notFound.back }}</a>
  `,
})
export class NotFound {
  readonly t = inject(I18nService).translations;
}
