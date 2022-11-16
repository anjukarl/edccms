import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { FileService } from '../../services/file.service';
import { Message } from '../../models';

@Component({
  selector: 'app-add-messages',
  templateUrl: './add-messages.component.html',
  styleUrls: ['./add-messages.component.css'],
})
export class AddMessagesComponent implements OnInit {
  form!: FormGroup;
  canClose = true;

  constructor(
    private dialogRef: MatDialogRef<AddMessagesComponent>,
    private fb: FormBuilder,
    private fileService: FileService
  ) {
    this.form = this.fb.group({
      speaker: ['', Validators.required],
      title: ['', Validators.required],
      videoUrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  save() {
    this.saveMessage();
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  saveMessage() {
    let newMessage: Partial<Message> = {};
    newMessage.speaker = this.form.value.speaker;
    newMessage.title = this.form.value.title;
    newMessage.videoUrl = this.form.value.videoUrl;
    this.fileService.createMessage(newMessage);
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
