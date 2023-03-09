import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FileService } from '../../services/file.service';
import { MessageAudio } from '../../models';

@Component({
  selector: 'app-add-messagesaudio',
  templateUrl: './add-messagesaudio.component.html',
  styleUrls: ['./add-messagesaudio.component.css'],
})
export class AddMessagesaudioComponent implements OnInit {
  form!: FormGroup;
  percentageChanges$!: Observable<number>;
  filen = '';
  canClose = true;

  constructor(
    private dialogRef: MatDialogRef<AddMessagesaudioComponent>,
    private fb: FormBuilder,
    private fileService: FileService,
    private storage: AngularFireStorage
  ) {
    this.form = this.fb.group({
      speaker: ['', Validators.required],
      title: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  uploadMessageaudio(event: any) {
    const file = event.target.files[0];
    this.canClose = false;

    let filename = file.name;
    this.filen = filename;
    filename = filename.split('.').join('-' + Date.now() + '.');

    const filePath = `/messagesaudio/${filename}`;
    const storageRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, file);

    this.percentageChanges$ = task.percentageChanges() as Observable<number>;
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadUrl) => {
            this.saveMessaudioInfo(downloadUrl, filename);
            this.canClose = true;
          });
        })
      )
      .subscribe();
  }

  saveMessaudioInfo(dlurl: string, fileName: string) {
    let newMessaudio: Partial<MessageAudio> = {};
    newMessaudio.speaker = this.form.value.speaker;
    newMessaudio.title = this.form.value.title;
    newMessaudio.path = dlurl;
    newMessaudio.fileName = fileName;
    this.fileService.createMessageaudio(newMessaudio);
  }

  get speaker() {
    return this.form.controls['speaker'];
  }

  get title() {
    return this.form.controls['title'];
  }
}
