import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { FileService } from '../../services/file.service';
import { DailyWord } from '../../models';

@Component({
  selector: 'app-edit-dw',
  templateUrl: './edit-dw.component.html',
  styleUrls: ['./edit-dw.component.css'],
})
export class EditDwComponent implements OnInit {
  form!: FormGroup;
  canClose = true;
  dword!: DailyWord;

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
    private dialogRef: MatDialogRef<EditDwComponent>,
    private fb: FormBuilder,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) dword: DailyWord
  ) {
    this.dword = dword;
    this.form = this.fb.group({
      title: [dword.title, Validators.required],
      text: [dword.text, Validators.required],
    });
  }

  ngOnInit(): void {}

  save() {
    const changes = this.form.value;
    this.fileService.updateDword(this.dword.id!, changes).subscribe(() => {
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
