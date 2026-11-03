import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CONTENT, ContentSnapshot } from './content/content';
// Written before every build by `npm run content` (D25); a build without it fails.
import snapshot from './content/content.generated.json';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    { provide: CONTENT, useValue: snapshot satisfies ContentSnapshot },
  ]
};
