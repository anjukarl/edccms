import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Track,
  Book,
  Videos,
  Bibverses,
  Qanda,
  DailyWord,
  Bookpdf,
  Songs,
  Message,
  MessageAudio,
  Series,
  Sermon,
  YTPlaylist,
} from '../models';
import { convertSnaps } from './utils';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  tracks: Track[] = [];
  private basePath = '/audioFiles';
  private bookPath = '/books';
  private sermonPath = '/audioSermons';
  private messAudioPath = '/messagesaudio';
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  /*
    Other's messages - AUDIO  ==================================
  */

  loadMessagesaudio(): Observable<MessageAudio[]> {
    return this.db
      .collection('messagesaudio', (ref) => ref.orderBy('speaker'))
      .get()
      .pipe(map((results) => convertSnaps<MessageAudio>(results)));
  }

  deleteMessageaudio(messaudioId: string, messageName: string) {
    const storageRef = this.storage.ref(this.messAudioPath);
    storageRef.child(messageName).delete();
    return from(this.db.doc(`messagesaudio/${messaudioId}`).delete());
  }

  updateMessageaudio(
    messaudioId: string,
    changes: Partial<MessageAudio>
  ): Observable<any> {
    return from(this.db.doc(`messagesaudio/${messaudioId}`).update(changes));
  }

  createMessageaudio(newmessAudio: Partial<MessageAudio>) {
    let save$: Observable<any>;
    save$ = from(this.db.collection('messagesaudio').add(newmessAudio));
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
          ...newmessAudio,
        };
      })
    );
  }

  /*
    Audio Sermons  ==================================
  */

  loadSermons(): Observable<Sermon[]> {
    return this.db
      .collection('sermons', (ref) => ref.orderBy('series'))
      .get()
      .pipe(map((results) => convertSnaps<Sermon>(results)));
  }

  // deleteSermon(sermonId: string, sermonName: string) {
  //   if (sermonName.length > 0) {
  //     const storageRef = this.storage.ref(this.sermonPath);
  //     storageRef.child(sermonName).delete();
  //   }
  //   return from(this.db.doc(`sermons/${sermonId}`).delete());
  // }

  deleteSermon(sermonId: string) {
    return from(this.db.doc(`sermons/${sermonId}`).delete());
  }

  updateSermon(sermonId: string, changes: Partial<Sermon>): Observable<any> {
    return from(this.db.doc(`sermons/${sermonId}`).update(changes));
  }

  createSermon(newSermon: Partial<Sermon>) {
    let save$: Observable<any>;
    save$ = from(this.db.collection('sermons').add(newSermon));
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
          ...newSermon,
        };
      })
    );
  }

  /*
    Sermon Series Titles  ==================================
  */

  loadSeries(): Observable<Series[]> {
    return this.db
      .collection('series', (ref) => ref.orderBy('text'))
      .get()
      .pipe(map((results) => convertSnaps<Series>(results)));
  }

  deleteSeries(seriesId: string) {
    return from(this.db.doc(`series/${seriesId}`).delete());
  }

  updateSeries(seriesId: string, changes: Partial<Series>): Observable<any> {
    return from(this.db.doc(`series/${seriesId}`).update(changes));
  }

  createSeries(newSeries: Partial<Series>) {
    let save$: Observable<any>;
    save$ = from(this.db.collection('series').add(newSeries));
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
          ...newSeries,
        };
      })
    );
  }

  /*
    Messages  =====================================================
  */

  loadMessages(): Observable<Message[]> {
    return this.db
      .collection('messages')
      .get()
      .pipe(map((results) => convertSnaps<Message>(results)));
  }

  deleteMessage(messageId: string) {
    return from(this.db.doc(`messages/${messageId}`).delete());
  }

  updateMessage(messageId: string, changes: Partial<Message>): Observable<any> {
    return from(this.db.doc(`messages/${messageId}`).update(changes));
  }

  createMessage(newMessage: Partial<Message>) {
    let save$: Observable<any>;
    save$ = from(this.db.collection('messages').add(newMessage));
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
          ...newMessage,
        };
      })
    );
  }

  /*
    Songs  =====================================================
  */

  loadSongs(): Observable<Songs[]> {
    return this.db
      .collection('songs', (ref) => ref.orderBy('serialno', 'desc'))
      .get()
      .pipe(map((results) => convertSnaps<Songs>(results)));
  }

  deleteSongs(songsId: string) {
    return from(this.db.doc(`songs/${songsId}`).delete());
  }

  updateSongs(songsId: string, changes: Partial<Songs>): Observable<any> {
    return from(this.db.doc(`songs/${songsId}`).update(changes));
  }

  createSongs(newSongs: Partial<Songs>) {
    let save$: Observable<any>;
    save$ = from(this.db.collection('songs').add(newSongs));
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
          ...newSongs,
        };
      })
    );
  }

  /*
    Books  =====================================
  */

  loadBookpdfs(): Observable<Bookpdf[]> {
    return this.db
      .collection('bookpdfs')
      .get()
      .pipe(map((results) => convertSnaps<Bookpdf>(results)));
  }

  deleteBookpdf(bookpdfId: string, thumbname: string, filename: string) {
    const storageRef = this.storage.ref(this.bookPath);
    storageRef.child(thumbname).delete();
    storageRef.child(filename).delete();
    return from(this.db.doc(`bookpdfs/${bookpdfId}`).delete());
  }

  updateBookpdf(bookpdfId: string, changes: Partial<Bookpdf>): Observable<any> {
    return from(this.db.doc(`bookpdfs/${bookpdfId}`).update(changes));
  }

  createBookpdf(newBookpdf: Partial<Bookpdf>) {
    let save$: Observable<any>;
    save$ = from(this.db.collection('bookpdfs').add(newBookpdf));
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
          ...newBookpdf,
        };
      })
    );
  }

  /*
    Daily Word text and audio  =========================
  */

  loadDword(): Observable<DailyWord[]> {
    return this.db
      .collection('dailyword', (ref) => ref.orderBy('serialno', 'desc'))
      .get()
      .pipe(map((results) => convertSnaps<DailyWord>(results)));
  }

  deleteDword(dwordId: string) {
    return from(this.db.doc(`dailyword/${dwordId}`).delete());
  }

  updateDword(dwordId: string, changes: Partial<DailyWord>): Observable<any> {
    return from(this.db.doc(`dailyword/${dwordId}`).update(changes));
  }

  createDword(newDword: Partial<DailyWord>) {
    let save$: Observable<any>;
    save$ = from(this.db.collection('dailyword').add(newDword));
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
          ...newDword,
        };
      })
    );
  }

  /*
    With the Bible audio tracks  ===========================
  */

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

  /*
    Bible verses for hero images  ==================================
  */

  loadVerses(): Observable<Bibverses[]> {
    return this.db
      .collection('verses')
      .get()
      .pipe(map((results) => convertSnaps<Bibverses>(results)));
  }

  deleteVerse(verseId: string) {
    return from(this.db.doc(`verses/${verseId}`).delete());
  }

  createVerse(newVerse: Partial<Bibverses>) {
    let save$: Observable<any>;
    save$ = from(this.db.collection('verses').add(newVerse));
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
          ...newVerse,
        };
      })
    );
  }

  /*
    Questions & Answers  ======================================
  */

  loadQandas(): Observable<Qanda[]> {
    return this.db
      .collection('qanda', (ref) => ref.orderBy('serialno', 'desc'))
      .get()
      .pipe(map((results) => convertSnaps<Qanda>(results)));
  }

  deleteQanda(qandaId: string) {
    return from(this.db.doc(`qanda/${qandaId}`).delete());
  }

  updateQanda(qandaId: string, changes: Partial<Qanda>): Observable<any> {
    return from(this.db.doc(`qanda/${qandaId}`).update(changes));
  }

  createQanda(newQanda: Partial<Qanda>) {
    let save$: Observable<any>;
    save$ = from(this.db.collection('qanda').add(newQanda));
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
          ...newQanda,
        };
      })
    );
  }

  /*
    Getting Bible books from database for lookup fields  ============
  */

  loadBooks(): Observable<Book[]> {
    return this.db
      .collection('books', (ref) => ref.orderBy('order'))
      .get()
      .pipe(map((results) => convertSnaps<Book>(results)));
  }

  loadBooksByName(): Observable<Book[]> {
    return this.db
      .collection('books', (ref) => ref.orderBy('book'))
      .get()
      .pipe(map((results) => convertSnaps<Book>(results)));
  }

  /*
    Updating videos from YouTube to Firestore  =======================
  */

  createVideos(newVideos: Videos[]) {
    let batch = this.db.firestore.batch();

    for (const video of newVideos) {
      const docRef = this.db.collection('videos').doc().ref;
      batch.set(docRef, video);
    }
    return batch.commit();
  }

  createYTPlaylist(newPlaylist: YTPlaylist[]) {
    let batch = this.db.firestore.batch();

    for (const playlist of newPlaylist) {
      const docRef = this.db.collection('vplaylist').doc().ref;
      batch.set(docRef, playlist);
    }
    return batch.commit();
  }

  loadYTVideo(): Observable<Videos[]> {
    return this.db
      .collection('videos', (ref) => ref.orderBy('videoId'))
      .get()
      .pipe(map((results) => convertSnaps<Videos>(results)));
  }

  loadYTPlaylist(): Observable<YTPlaylist[]> {
    return this.db
      .collection('vplaylist', (ref) => ref.orderBy('playlistId'))
      .get()
      .pipe(map((results) => convertSnaps<YTPlaylist>(results)));
  }

  /*
    Temporary functions used when moving collections to new project
    and when including kannada language.
  */

  updatePath() {
    this.loadTracks().subscribe((tracklist) => {
      this.tracks = tracklist;
      let records = 0;
      this.tracks.forEach((audio) => {
        const filename = audio.fileName;
        const filePath = `/audioFiles/${filename}`;
        const storageRef = this.storage.ref(filePath);

        storageRef.getDownloadURL().subscribe((downloadUrl) => {
          this.updateTrackInfo(audio.id, downloadUrl).subscribe(() => {
            records += 1;
            console.log(`Updated url: ${records}: `, audio.id);
          });
        });
      });
    });
  }

  updateTrackInfo(trackId: string, url: string) {
    return from(this.db.doc(`audio/${trackId}`).update({ path: url }));
  }

  updateName() {
    this.loadTracks().subscribe((tracklist) => {
      this.tracks = tracklist;
      let records = 0;
      this.tracks.forEach((audio) => {
        this.updateNameField(audio.id).subscribe(() => {
          records += 1;
          console.log(`Updated url: ${records}: `, audio.id);
        });
      });
    });
  }

  updateNameField(trackId: string) {
    return from(this.db.doc(`audio/${trackId}`).update({ namk: '' }));
  }
}
