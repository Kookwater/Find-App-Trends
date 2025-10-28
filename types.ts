
export interface Source {
  uri: string;
  title: string;
}

export interface CardData {
  title: string;
  description: string;
}

export interface SearchResult {
  data: CardData[];
  sources: Source[];
}
