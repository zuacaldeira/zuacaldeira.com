export interface NavItem {
  label: string;
  route: string;
  icon: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label: string;
}

export interface PortfolioProject {
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  image?: string;
}

export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract: string;
  doi?: string;
  url?: string;
}

export interface Race {
  name: string;
  date: string;
  distance: string;
  location: string;
  result?: string;
  upcoming: boolean;
}

export interface Facharbeit {
  title: string;
  subject: string;
  year: number;
  pdfUrl?: string;
  description: string;
}

export interface Praesentation {
  title: string;
  subject: string;
  year: number;
  pdfUrl?: string;
  description: string;
}
