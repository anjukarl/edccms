import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { FileService } from '../../services/file.service';
import { Qanda } from '../../models';
import { take } from 'rxjs';

@Component({
  selector: 'app-add-qanda',
  templateUrl: './add-qanda.component.html',
  styleUrls: ['./add-qanda.component.css'],
})
export class AddQandaComponent implements OnInit {
  form!: FormGroup;
  canClose = true;
  newserial = 0;

  constructor(
    private dialogRef: MatDialogRef<AddQandaComponent>,
    private fb: FormBuilder,
    private fileService: FileService
  ) {
    this.form = this.fb.group({
      serialno: [this.newserial, Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fileService
      .loadQandas()
      .pipe(take(1))
      .subscribe((res) => {
        this.newserial = res[0].serialno + 1;
        this.form = this.fb.group({
          serialno: [this.newserial, Validators.required],
          question: ['', Validators.required],
          answer: ['', Validators.required],
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
    let newQanda: Partial<Qanda> = {};
    newQanda.question = this.form.value.question;
    newQanda.answer = this.form.value.answer;
    newQanda.serialno = +this.form.value.serialno;
    this.fileService.createQanda(newQanda);
  }

  get question() {
    return this.form.controls['question'];
  }
  get answer() {
    return this.form.controls['answer'];
  }
}
