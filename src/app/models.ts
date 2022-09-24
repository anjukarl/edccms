export interface Track {
  id: string;
  book: string;
  name: string;
  namk: string;
  path: string;
  fileName: string;
  duration: number;
}

export interface Book {
  id?: string;
  book: string;
  order: number;
}
