import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { PaperStatements } from './paper-statements/paper-statements';

@Component({
  selector: 'app-home',
  imports: [Hero, PaperStatements],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
