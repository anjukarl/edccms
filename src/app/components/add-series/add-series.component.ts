import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { FileService } from '../../services/file.service';
import { Series } from '../../models';

@Component({
  selector: 'app-add-series',
  templateUrl: './add-series.component.html',
  styleUrls: ['./add-series.component.css'],
})
export class AddSeriesComponent implements OnInit {
  form!: FormGroup;
  canClose = true;

  constructor(
    private dialogRef: MatDialogRef<AddSeriesComponent>,
    private fb: FormBuilder,
    private fileService: FileService
  ) {
    this.form = this.fb.group({
      text: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  save() {
    this.saveSeriesInfo();
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  saveSeriesInfo() {
    let newSeries: Partial<Series> = {};
    newSeries.text = this.form.value.text;
    this.fileService.createSeries(newSeries);
  }

  get text() {
    return this.form.controls['text'];
  }
}
