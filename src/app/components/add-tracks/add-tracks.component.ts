import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FileService } from '../../services/file.service';
import { Track, Book } from '../../models';

@Component({
  selector: 'app-add-tracks',
  templateUrl: './add-tracks.component.html',
  styleUrls: ['./add-tracks.component.css'],
})
export class AddTracksComponent implements OnInit {
  form!: FormGroup;
  percentageChanges$!: Observable<number>;
  books$!: Observable<Book[]>;
  filen = '';
  canClose = true;

  constructor(
    private dialogRef: MatDialogRef<AddTracksComponent>,
    private fb: FormBuilder,
    private fileService: FileService,
    private storage: AngularFireStorage
  ) {
    this.form = this.fb.group({
      book: ['', Validators.required],
      name: ['', Validators.required],
      namk: [''],
    });
  }

  ngOnInit(): void {
    this.books$ = this.fileService.loadBooksByName();
  }

  close() {
    this.dialogRef.close();
  }

  async uploadTrack(event: any) {
    const file = event.target.files[0];
    this.canClose = false;

    let filename = file.name;
    this.filen = filename;
    filename = filename.split('.').join('-' + Date.now() + '.');

    const filePath = `/audioFiles/${filename}`;
    const storageRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, file);

    this.percentageChanges$ = task.percentageChanges() as Observable<number>;
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadUrl) => {
            this.saveTrackInfo(downloadUrl, filename);
            this.canClose = true;
          });
        })
      )
      .subscribe();
  }

  saveTrackInfo(dlurl: string, fileName: string) {
    let newTrack: Partial<Track> = {};
    newTrack.book = this.form.value.book;
    newTrack.name = this.form.value.name;
    newTrack.namk = this.form.value.namk;
    newTrack.path = dlurl;
    newTrack.fileName = fileName;
    this.fileService.createTrack(newTrack);
  }

  get book() {
    return this.form.controls['book'];
  }
  get name() {
    return this.form.controls['name'];
  }
}
