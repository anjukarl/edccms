export interface Bibverses {
  id?: string;
  reference: string;
  text: string;
}

export interface Book {
  book: string;
  id?: string;
  order: number;
}

export interface Bookpdf {
  author: string;
  filename: string;
  id?: string;
  filepath: string;
  thumbpath: string;
  thumbname: string;
  title: string;
}

export interface DailyWord {
  id?: string;
  text: string;
  title: string;
}

export interface Qanda {
  answer: string;
  id?: string;
  question: string;
  serialno: string;
}

export interface Songs {
  id?: string;
  text: string;
  title: string;
}

export interface Track {
  book: string;
  duration: number;
  fileName: string;
  id: string;
  name: string;
  namk: string;
  path: string;
}

export interface VidData {
  items: [
    {
      id: { videoId: string };
      snippet: { title: string; thumbnails: { default: { url: string } } };
    }
  ];
  nextPageToken: string;
}

export interface Videos {
  date?: string;
  playlist?: string;
  thumbnail: string;
  title: string;
  type?: string;
  videoId: string;
}
