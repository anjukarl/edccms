export interface Track {
  id?: string;
  book: string;
  name: string;
  path: string;
  duration: number;
}

export interface Book {
  id?: string;
  book: string;
  order: number;
}
