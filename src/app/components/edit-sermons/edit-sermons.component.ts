import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { FileService } from '../../services/file.service';
import { Series, Sermon } from '../../models';

@Component({
  selector: 'app-edit-sermons',
  templateUrl: './edit-sermons.component.html',
  styleUrls: ['./edit-sermons.component.css'],
})
export class EditSermonsComponent implements OnInit {
  form!: FormGroup;
  canClose = true;
  sermon!: Sermon;
  series$!: Observable<Series[]>;

  constructor(
    private dialogRef: MatDialogRef<EditSermonsComponent>,
    private fb: FormBuilder,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) sermon: Sermon
  ) {
    this.sermon = sermon;
    this.form = this.fb.group({
      series: [sermon.series],
      title: [sermon.title, Validators.required],
      description: [sermon.description],
    });
  }

  ngOnInit(): void {
    this.series$ = this.fileService.loadSeries();
  }

  save() {
    const changes = this.form.value;
    this.fileService.updateSermon(this.sermon.id!, changes).subscribe(() => {
      this.dialogRef.close(changes);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  get title() {
    return this.form.controls['title'];
  }
}
