import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FileService } from '../../services/file.service';
import { Bookpdf } from '../../models';

@Component({
  selector: 'app-add-books',
  templateUrl: './add-books.component.html',
  styleUrls: ['./add-books.component.css'],
})
export class AddBooksComponent implements OnInit {
  form!: FormGroup;
  percentageChanges1$!: Observable<number>;
  percentageChanges2$!: Observable<number>;
  pdfname = '';
  pdfpath = '';
  thumbname = '';
  thumbpath = '';
  canClose = true;

  constructor(
    private dialogRef: MatDialogRef<AddBooksComponent>,
    private fb: FormBuilder,
    private fileService: FileService,
    private storage: AngularFireStorage
  ) {
    this.form = this.fb.group({
      author: ['', Validators.required],
      title: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  async uploadThumb(event: any) {
    const file = event.target.files[0];
    this.canClose = false;

    this.thumbname = file.name;

    const filePath = `/books/${this.thumbname}`;
    const storageRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, file);

    this.percentageChanges1$ = task.percentageChanges() as Observable<number>;
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadUrl) => {
            this.thumbpath = downloadUrl;
            this.canClose = true;
          });
        })
      )
      .subscribe();
  }

  async uploadPdf(event: any) {
    const file = event.target.files[0];
    this.canClose = false;

    this.pdfname = file.name;

    const filePath = `/books/${this.pdfname}`;
    const storageRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, file);

    this.percentageChanges2$ = task.percentageChanges() as Observable<number>;
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadUrl) => {
            this.pdfpath = downloadUrl;
            this.saveBookpdfInfo();
            this.canClose = true;
          });
        })
      )
      .subscribe();
  }

  saveBookpdfInfo() {
    let newBookpdf: Partial<Bookpdf> = {};
    newBookpdf.author = this.form.value.author;
    newBookpdf.title = this.form.value.title;
    newBookpdf.filename = this.pdfname;
    newBookpdf.filepath = this.pdfpath;
    newBookpdf.thumbname = this.thumbname;
    newBookpdf.thumbpath = this.thumbpath;
    this.fileService.createBookpdf(newBookpdf);
  }

  get author() {
    return this.form.controls['author'];
  }
  get title() {
    return this.form.controls['title'];
  }
}
