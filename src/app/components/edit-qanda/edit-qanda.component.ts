import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FileService } from '../../services/file.service';
import { Qanda } from '../../models';

@Component({
  selector: 'app-edit-qanda',
  templateUrl: './edit-qanda.component.html',
  styleUrls: ['./edit-qanda.component.css'],
})
export class EditQandaComponent implements OnInit {
  form!: FormGroup;
  canClose = true;
  qanda!: Qanda;

  constructor(
    private dialogRef: MatDialogRef<EditQandaComponent>,
    private fb: FormBuilder,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) qanda: Qanda
  ) {
    this.qanda = qanda;
    this.form = this.fb.group({
      serialno: [qanda.serialno],
      question: [qanda.question, Validators.required],
      answer: [qanda.answer, Validators.required],
    });
  }

  ngOnInit(): void {}

  save() {
    const changes = this.form.value;
    this.fileService.updateQanda(this.qanda.id!, changes).subscribe(() => {
      this.dialogRef.close(changes);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  get question() {
    return this.form.controls['question'];
  }
  get answer() {
    return this.form.controls['answer'];
  }
}
