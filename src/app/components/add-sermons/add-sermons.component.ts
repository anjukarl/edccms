import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FileService } from '../../services/file.service';
import { Series, Sermon } from '../../models';

@Component({
  selector: 'app-add-sermons',
  templateUrl: './add-sermons.component.html',
  styleUrls: ['./add-sermons.component.css'],
})
export class AddSermonsComponent implements OnInit {
  form!: FormGroup;
  percentageChanges$!: Observable<number>;
  series$!: Observable<Series[]>;
  filen = '';
  canClose = true;

  constructor(
    private dialogRef: MatDialogRef<AddSermonsComponent>,
    private fb: FormBuilder,
    private fileService: FileService,
    private storage: AngularFireStorage
  ) {
    this.form = this.fb.group({
      series: [''],
      title: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.series$ = this.fileService.loadSeries();
  }

  close() {
    this.dialogRef.close();
  }

  uploadSermon(event: any) {
    const file = event.target.files[0];
    this.canClose = false;

    let filename = file.name;
    this.filen = filename;
    filename = filename.split('.').join('-' + Date.now() + '.');

    const filePath = `/audioSermons/${filename}`;
    const storageRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, file);

    this.percentageChanges$ = task.percentageChanges() as Observable<number>;
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadUrl) => {
            this.saveSermonInfo(downloadUrl, filename);
            this.canClose = true;
          });
        })
      )
      .subscribe();
  }

  saveSermonInfo(dlurl: string, fileName: string) {
    let newSermon: Partial<Sermon> = {};
    newSermon.series = this.form.value.series;
    newSermon.title = this.form.value.title;
    newSermon.path = dlurl;
    newSermon.fileName = fileName;
    this.fileService.createSermon(newSermon);
  }

  get title() {
    return this.form.controls['title'];
  }
}
