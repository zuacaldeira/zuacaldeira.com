import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SectionHeader } from '../../common/section-header/section-header';
import { FacharbeitenList } from './facharbeiten-list/facharbeiten-list';
import { PraesentationenList } from './praesentationen-list/praesentationen-list';

@Component({
  selector: 'app-paedagogik',
  imports: [MatTabsModule, SectionHeader, FacharbeitenList, PraesentationenList],
  templateUrl: './paedagogik.html',
  styleUrl: './paedagogik.css',
})
export class Paedagogik {}
