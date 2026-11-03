import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <h1>⊥ Page not found</h1>
    <p>This path ends at the bottom: there is no page here.</p>
    <a routerLink="/en/home">Back to the home page</a>
  `,
})
export class NotFound {}
