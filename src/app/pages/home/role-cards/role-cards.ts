import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-role-cards',
  imports: [RouterLink, MatCardModule, MatIconModule],
  templateUrl: './role-cards.html',
  styleUrl: './role-cards.css',
})
export class RoleCards {
  readonly t = inject(I18nService).translations;

  private static readonly ROLE_META = [
    { icon: 'science', route: '/research' },
    { icon: 'code', route: '/work' },
    { icon: 'school', route: '/paedagogik' },
    { icon: 'directions_run', route: '/running' },
  ] as const;

  readonly roles = computed(() =>
    RoleCards.ROLE_META.map((meta, i) => ({
      ...meta,
      title: this.t().roleCards[i].title,
      description: this.t().roleCards[i].description,
    }))
  );
}
