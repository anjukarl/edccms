import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { FileService } from '../../services/file.service';
import { Songs } from '../../models';

@Component({
  selector: 'app-edit-songs',
  templateUrl: './edit-songs.component.html',
  styleUrls: ['./edit-songs.component.css'],
})
export class EditSongsComponent implements OnInit {
  form!: FormGroup;
  canClose = true;
  song!: Songs;

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
    private dialogRef: MatDialogRef<EditSongsComponent>,
    private fb: FormBuilder,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) song: Songs
  ) {
    this.song = song;
    this.form = this.fb.group({
      title: [song.title, Validators.required],
      text: [song.text, Validators.required],
    });
  }

  ngOnInit(): void {}

  save() {
    const changes = this.form.value;
    this.fileService.updateSongs(this.song.id!, changes).subscribe(() => {
      this.dialogRef.close(changes);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  get title() {
    return this.form.controls['title'];
  }

  get text() {
    return this.form.controls['text'];
  }
}
