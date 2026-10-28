import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { I18nService } from '../../services/i18n.service';
import { Hero } from './hero/hero';
import { PaperStatements } from './paper-statements/paper-statements';

@Component({
  selector: 'app-home',
  imports: [Hero, PaperStatements],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor() {
    const t = inject(I18nService).translations();
    inject(Title).setTitle(`Alexandre Caldeira — ${t.hero.tagline}`);
  }
}
