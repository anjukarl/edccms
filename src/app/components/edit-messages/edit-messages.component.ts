import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FileService } from '../../services/file.service';
import { Message } from '../../models';

@Component({
  selector: 'app-edit-messages',
  templateUrl: './edit-messages.component.html',
  styleUrls: ['./edit-messages.component.css'],
})
export class EditMessagesComponent implements OnInit {
  form!: FormGroup;
  canClose = true;
  message!: Message;

  constructor(
    private dialogRef: MatDialogRef<EditMessagesComponent>,
    private fb: FormBuilder,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) message: Message
  ) {
    this.message = message;
    this.form = this.fb.group({
      speaker: [message.speaker, Validators.required],
      title: [message.title, Validators.required],
      videoUrl: [message.videoUrl, Validators.required],
    });
  }

  ngOnInit(): void {}

  save() {
    const changes = this.form.value;
    this.fileService.updateMessage(this.message.id!, changes).subscribe(() => {
      this.dialogRef.close(changes);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  get speaker() {
    return this.form.controls['speaker'];
  }
  get title() {
    return this.form.controls['title'];
  }
  get videoUrl() {
    return this.form.controls['videoUrl'];
  }
}
