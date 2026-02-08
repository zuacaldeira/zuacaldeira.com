import { TestBed } from '@angular/core/testing';
import { ContentService } from './content.service';

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(() => {
    service = TestBed.inject(ContentService);
  });

  describe('navItems', () => {
    it('should have 7 navigation items', () => {
      expect(service.navItems).toHaveLength(7);
    });

    it('should have valid route paths starting with /', () => {
      for (const item of service.navItems) {
        expect(item.route).toMatch(/^\//);
      }
    });

    it('should have non-empty labels and icons', () => {
      for (const item of service.navItems) {
        expect(item.label).toBeTruthy();
        expect(item.icon).toBeTruthy();
      }
    });

    it('should include Home as first item routing to /home', () => {
      expect(service.navItems[0]).toEqual({ label: 'Home', route: '/home', icon: 'home' });
    });

    it('should include Contact as last item', () => {
      expect(service.navItems[service.navItems.length - 1].route).toBe('/contact');
    });
  });

  describe('socialLinks', () => {
    it('should have 4 social links', () => {
      expect(service.socialLinks).toHaveLength(4);
    });

    it('should have valid URLs', () => {
      for (const link of service.socialLinks) {
        expect(link.url).toMatch(/^https?:\/\/|^mailto:/);
      }
    });

    it('should have non-empty platform names, icons, and labels', () => {
      for (const link of service.socialLinks) {
        expect(link.platform).toBeTruthy();
        expect(link.icon).toBeTruthy();
        expect(link.label).toBeTruthy();
      }
    });

    it('should include GitHub, LinkedIn, Strava, and Email', () => {
      const platforms = service.socialLinks.map((l) => l.platform);
      expect(platforms).toEqual(['GitHub', 'LinkedIn', 'Strava', 'Email']);
    });
  });

  describe('projects', () => {
    it('should have 4 projects', () => {
      expect(service.projects).toHaveLength(4);
    });

    it('should have non-empty titles, descriptions, and tags', () => {
      for (const project of service.projects) {
        expect(project.title).toBeTruthy();
        expect(project.description).toBeTruthy();
        expect(project.tags.length).toBeGreaterThan(0);
      }
    });

    it('should have valid URLs where provided', () => {
      for (const project of service.projects) {
        if (project.repoUrl) {
          expect(project.repoUrl).toMatch(/^https:\/\//);
        }
        if (project.liveUrl) {
          expect(project.liveUrl).toMatch(/^https:\/\//);
        }
      }
    });
  });

  describe('publications', () => {
    it('should have at least 1 publication', () => {
      expect(service.publications.length).toBeGreaterThanOrEqual(1);
    });

    it('should have non-empty titles, authors, venues, and abstracts', () => {
      for (const pub of service.publications) {
        expect(pub.title).toBeTruthy();
        expect(pub.authors.length).toBeGreaterThan(0);
        expect(pub.venue).toBeTruthy();
        expect(pub.abstract).toBeTruthy();
      }
    });

    it('should have valid years', () => {
      for (const pub of service.publications) {
        expect(pub.year).toBeGreaterThanOrEqual(2000);
        expect(pub.year).toBeLessThanOrEqual(new Date().getFullYear());
      }
    });
  });

  describe('races', () => {
    it('should have at least 1 race', () => {
      expect(service.races.length).toBeGreaterThanOrEqual(1);
    });

    it('should have non-empty names, dates, distances, and locations', () => {
      for (const race of service.races) {
        expect(race.name).toBeTruthy();
        expect(race.date).toBeTruthy();
        expect(race.distance).toBeTruthy();
        expect(race.location).toBeTruthy();
      }
    });

    it('should have valid ISO date strings', () => {
      for (const race of service.races) {
        expect(race.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('should have results only for completed races', () => {
      for (const race of service.races) {
        if (race.upcoming) {
          expect(race.result).toBeUndefined();
        } else {
          expect(race.result).toBeTruthy();
        }
      }
    });
  });

  describe('facharbeiten', () => {
    it('should have at least 1 facharbeit', () => {
      expect(service.facharbeiten.length).toBeGreaterThanOrEqual(1);
    });

    it('should have non-empty titles, subjects, and descriptions', () => {
      for (const fa of service.facharbeiten) {
        expect(fa.title).toBeTruthy();
        expect(fa.subject).toBeTruthy();
        expect(fa.description).toBeTruthy();
      }
    });

    it('should have PDF URLs pointing to assets directory', () => {
      for (const fa of service.facharbeiten) {
        if (fa.pdfUrl) {
          expect(fa.pdfUrl).toMatch(/^assets\/pdfs\//);
        }
      }
    });
  });

  describe('praesentationen', () => {
    it('should be an array', () => {
      expect(Array.isArray(service.praesentationen)).toBe(true);
    });
  });

  describe('immutability', () => {
    it('should expose readonly arrays', () => {
      expect(Object.isFrozen(service.navItems)).toBe(false);
      expect(service.navItems).toEqual(expect.any(Array));
      expect(service.socialLinks).toEqual(expect.any(Array));
      expect(service.projects).toEqual(expect.any(Array));
      expect(service.publications).toEqual(expect.any(Array));
      expect(service.races).toEqual(expect.any(Array));
      expect(service.facharbeiten).toEqual(expect.any(Array));
      expect(service.praesentationen).toEqual(expect.any(Array));
    });
  });
});
