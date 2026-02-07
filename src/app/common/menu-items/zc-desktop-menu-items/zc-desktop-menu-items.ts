import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-zc-desktop-menu-items',
  imports: [RouterModule],
  templateUrl: './zc-desktop-menu-items.html',
  styleUrl: './zc-desktop-menu-items.css',
})
export class ZcDesktopMenuItems {
  private contentService = inject(ContentService);
  readonly navItems = this.contentService.navItems;
}
