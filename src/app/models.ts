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
