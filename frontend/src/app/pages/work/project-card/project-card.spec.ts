import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProjectCard } from './project-card';
import { PortfolioProject } from '../../../models/models';

describe('ProjectCard', () => {
  const mockProject: PortfolioProject = {
    title: 'Test Project',
    description: 'A test project description.',
    tags: ['Angular', 'TypeScript'],
    repoUrl: 'https://github.com/test/test',
    liveUrl: 'https://test.com',
  };

  it('should create with project input', () => {
    const fixture = TestBed.overrideComponent(ProjectCard, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(ProjectCard);
    fixture.componentInstance.project = mockProject;
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should accept a project input', () => {
    const fixture = TestBed.overrideComponent(ProjectCard, {
      set: { schemas: [NO_ERRORS_SCHEMA] },
    }).createComponent(ProjectCard);
    fixture.componentInstance.project = mockProject;
    fixture.detectChanges();
    expect(fixture.componentInstance.project).toBe(mockProject);
  });
});
