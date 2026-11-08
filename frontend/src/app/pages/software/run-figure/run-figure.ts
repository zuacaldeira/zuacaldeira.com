import { Component, input } from '@angular/core';

/** The Run step drawn like the lattice: one action, three results (software-spec.md, `RunFigure`). */
@Component({
  selector: 'app-run-figure',
  templateUrl: './run-figure.html',
})
export class RunFigure {
  readonly label = input.required<string>();
}
