import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-zc-sidenav-menu-items',
  imports: [MatListModule, MatIconModule, RouterModule],
  templateUrl: './zc-sidenav-menu-items.html',
  styleUrl: './zc-sidenav-menu-items.css',
})
export class ZcSidenavMenuItems {
  private contentService = inject(ContentService);
  readonly navItems = this.contentService.navItems;
}
