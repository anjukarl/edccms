import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { FileService } from '../../services/file.service';
import { Qanda } from '../../models';

@Component({
  selector: 'app-add-qanda',
  templateUrl: './add-qanda.component.html',
  styleUrls: ['./add-qanda.component.css'],
})
export class AddQandaComponent implements OnInit {
  form!: FormGroup;
  canClose = true;

  constructor(
    private dialogRef: MatDialogRef<AddQandaComponent>,
    private fb: FormBuilder,
    private fileService: FileService
  ) {
    this.form = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  save() {
    this.saveVerseInfo();
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  saveVerseInfo() {
    let newQanda: Partial<Qanda> = {};
    newQanda.question = this.form.value.question;
    newQanda.answer = this.form.value.answer;
    this.fileService.createQanda(newQanda);
  }

  get question() {
    return this.form.controls['question'];
  }
  get answer() {
    return this.form.controls['answer'];
  }
}
