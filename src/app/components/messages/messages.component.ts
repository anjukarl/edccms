import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { FileService } from '../../services/file.service';
import { DialogService } from '../../services/dialog.service';
import { Message } from '../../models';
import { AddMessagesComponent } from '../add-messages/add-messages.component';
import { EditMessagesComponent } from '../edit-messages/edit-messages.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  columnsToDisplay = ['speaker', 'title', 'actions'];
  dataSource!: MatTableDataSource<any>;
  loading = false;
  searchKey: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fileService: FileService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.reloadMessages();
  }

  reloadMessages() {
    this.loading = true;
    this.fileService
      .loadMessages()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((messageList) => {
        this.dataSource = new MatTableDataSource(messageList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  addMessage() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '600px';

    this.dialog
      .open(AddMessagesComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadMessages();
        this.onSearchClear();
      });
  }

  updateMessage(message: Message) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '600px';
    dialogConfig.data = message;

    this.dialog
      .open(EditMessagesComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadMessages();
        this.onSearchClear();
      });
  }

  deleteMessage(message: Message) {
    this.dialogService
      .openConfirmDialog('Are you sure you want to delete?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.fileService
            .deleteMessage(message.id!)
            .pipe(finalize(() => this.reloadMessages()))
            .subscribe();
        }
      });
  }
}
