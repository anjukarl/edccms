import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FileService } from '../../services/file.service';
import { Series } from '../../models';

@Component({
  selector: 'app-edit-series',
  templateUrl: './edit-series.component.html',
  styleUrls: ['./edit-series.component.css'],
})
export class EditSeriesComponent implements OnInit {
  form!: FormGroup;
  canClose = true;
  series!: Series;

  constructor(
    private dialogRef: MatDialogRef<EditSeriesComponent>,
    private fb: FormBuilder,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) series: Series
  ) {
    this.series = series;
    this.form = this.fb.group({
      text: [series.text],
    });
  }

  ngOnInit(): void {}

  save() {
    const changes = this.form.value;
    this.fileService.updateSeries(this.series.id!, changes).subscribe(() => {
      this.dialogRef.close(changes);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  get text() {
    return this.form.controls['text'];
  }
}
