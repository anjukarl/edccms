import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(
    private dialogRef: MatDialogRef<AddTracksComponent>,
    private fb: FormBuilder,
    private fileService: FileService,
    private storage: AngularFireStorage
  ) {
    this.form = this.fb.group({
      book: ['', Validators.required],
      name: ['', Validators.required],
      duration: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.books$ = this.fileService.loadBooks();
  }

  close() {
    this.dialogRef.close();
  }

  async uploadTrack(event: any) {
    const file = event.target.files[0];
    const filePath = `/audioFiles/${file.name}`;
    const storageRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, file);

    this.percentageChanges$ = task.percentageChanges() as Observable<number>;
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadUrl) => {
            this.saveTrackInfo(downloadUrl);
          });
        })
      )
      .subscribe();
  }

  saveTrackInfo(dlurl: string) {
    let newTrack: Partial<Track> = {};
    newTrack.book = this.form.value.book;
    newTrack.name = this.form.value.name;
    newTrack.duration = +this.form.value.duration;
    newTrack.path = dlurl;
    this.fileService.createTrack(newTrack);
  }

  get book() {
    return this.form.controls['book'];
  }
  get name() {
    return this.form.controls['name'];
  }
  get duration() {
    return this.form.controls['duration'];
  }
}
