import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { FileService } from '../../services/file.service';
import { DailyWord } from '../../models';
import { take } from 'rxjs';

@Component({
  selector: 'app-add-dw',
  templateUrl: './add-dw.component.html',
  styleUrls: ['./add-dw.component.css'],
})
export class AddDwComponent implements OnInit {
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
    private dialogRef: MatDialogRef<AddDwComponent>,
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
      .loadDword()
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
    this.saveVerseInfo();
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  saveVerseInfo() {
    let newDword: Partial<DailyWord> = {};
    // newDword.serialno = +this.form.value.serialno;
    newDword.serialno = this.newserial;
    newDword.title = this.form.value.title;
    newDword.text = this.form.value.text;
    this.fileService.createDword(newDword);
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
