import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Track, Book } from '../models';
import { convertSnaps } from './utils';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private basePath = '/audioFiles';
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  createTrack(newTrack: Partial<Track>) {
    let save$: Observable<any>;
    save$ = from(this.db.collection('audio').add(newTrack));
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
          ...newTrack,
        };
      })
    );
  }

  deleteTrack(trackId: string, trackName: string) {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(trackName).delete();
    return from(this.db.doc(`audio/${trackId}`).delete());
  }

  loadTracks(): Observable<Track[]> {
    return this.db
      .collection('audio')
      .get()
      .pipe(map((results) => convertSnaps<Track>(results)));
  }

  loadBooks(): Observable<Book[]> {
    return this.db
      .collection('books', (ref) => ref.orderBy('order'))
      .get()
      .pipe(map((results) => convertSnaps<Book>(results)));
  }
}
