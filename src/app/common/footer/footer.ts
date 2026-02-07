import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private contentService = inject(ContentService);
  readonly navItems = this.contentService.navItems;
  readonly socialLinks = this.contentService.socialLinks;
  readonly currentYear = new Date().getFullYear();
}
