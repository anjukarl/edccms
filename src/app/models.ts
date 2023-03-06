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
  serialno: number;
}

export interface Message {
  id?: string;
  speaker: string;
  title: string;
  videoUrl: string;
}

export interface Qanda {
  answer: string;
  id?: string;
  question: string;
  serialno: number;
}

export interface Songs {
  id?: string;
  text: string;
  title: string;
  serialno: number;
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

export interface Sermon {
  id: string;
  fileName: string;
  title: string;
  series: string;
  path: string;
}

export interface Series {
  id?: string;
  text: string;
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
