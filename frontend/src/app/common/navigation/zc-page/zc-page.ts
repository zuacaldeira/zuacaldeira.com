import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { ZcNavMobile } from '../zc-nav-mobile/zc-nav-mobile';
import { ZcNavDesktop } from '../zc-nav-desktop/zc-nav-desktop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zc-page',
  imports: [CommonModule, ZcNavMobile, ZcNavDesktop],
  templateUrl: './zc-page.html',
  styleUrl: './zc-page.css',
})
export class ZcPage {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
}
