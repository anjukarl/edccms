import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { FileService } from '../../services/file.service';
import { Songs } from '../../models';
import { take } from 'rxjs';

@Component({
  selector: 'app-add-songs',
  templateUrl: './add-songs.component.html',
  styleUrls: ['./add-songs.component.css'],
})
export class AddSongsComponent implements OnInit {
  form!: FormGroup;
  canClose = true;
  newserial = 0;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '40vh',
    minHeight: '0',
    maxHeight: 'auto',
    width: '50vw',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  constructor(
    private dialogRef: MatDialogRef<AddSongsComponent>,
    private fb: FormBuilder,
    private fileService: FileService
  ) {
    this.form = this.fb.group({
      serialno: [this.newserial, Validators.required],
      title: ['', Validators.required],
      text: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fileService
      .loadSongs()
      .pipe(take(1))
      .subscribe((res) => {
        this.newserial = res[0].serialno + 1;
        this.form = this.fb.group({
          serialno: [this.newserial, Validators.required],
          title: ['', Validators.required],
          text: ['', Validators.required],
        });
      });
  }

  save() {
    this.saveSongsInfo();
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  saveSongsInfo() {
    let newSong: Partial<Songs> = {};
    newSong.serialno = +this.form.value.serialno;
    newSong.title = this.form.value.title;
    newSong.text = this.form.value.text;
    this.fileService.createSongs(newSong);
  }

  get title() {
    return this.form.controls['title'];
  }

  get text() {
    return this.form.controls['text'];
  }

  get serialno() {
    return this.form.controls['serialno'];
  }
}
