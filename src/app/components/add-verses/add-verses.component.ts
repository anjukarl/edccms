import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { FileService } from '../../services/file.service';
import { Bibverses } from '../../models';

@Component({
  selector: 'app-add-verses',
  templateUrl: './add-verses.component.html',
  styleUrls: ['./add-verses.component.css'],
})
export class AddVersesComponent implements OnInit {
  form!: FormGroup;
  canClose = true;

  constructor(
    private dialogRef: MatDialogRef<AddVersesComponent>,
    private fb: FormBuilder,
    private fileService: FileService
  ) {
    this.form = this.fb.group({
      reference: ['', Validators.required],
      text: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  save() {
    this.saveVerseInfo();
    this.dialogRef.close();
  }

  saveVerseInfo() {
    let newVerse: Partial<Bibverses> = {};
    newVerse.reference = this.form.value.reference;
    newVerse.text = this.form.value.text;
    this.fileService.createVerse(newVerse);
  }

  get reference() {
    return this.form.controls['reference'];
  }
  get text() {
    return this.form.controls['text'];
  }
}
