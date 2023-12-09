export interface QueryResponse {
  data: Data;
}

export interface Data {
  popularTitles: PopularTitles;
}

export interface PopularTitles {
  edges: Edge[];
}

export interface Edge {
  node: Node;
}

export interface Node {
  id: string;
  objectType: string;
  objectId: number;
  content: Content;
  watchNowOffer?: WatchNowOffer;
  offers: Offer[];
}

export interface Content {
  fullPath: string;
  title: string;
  ageCertification: string;
  genres: Genre[];
  credits: Credit[];
  originalReleaseYear: number;
  runtime: number;
  scoring: Scoring;
  shortDescription: string;
  fullPosterUrl: string;
  fullBackdrops: FullBackdrop[];
}

export interface Genre {
  shortName: string;
}

export interface Credit {
  name: string;
}

export interface FullBackdrop {
  backdropUrl: string;
}

export interface WatchNowOffer {
  id: string;
  standardWebURL: string;
  package: Package;
}

export interface Offer {
  standardWebURL: string;
  package: Package;
}

export interface Package {
  clearName: string;
}

export interface Scoring {
  imdbScore: number;
  imdbVotes: number;
}
