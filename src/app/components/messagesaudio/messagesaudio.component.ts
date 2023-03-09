import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { MessageAudio } from '../../models';
import { FileService } from '../../services/file.service';
import { DialogService } from '../../services/dialog.service';
import { AddMessagesaudioComponent } from '../../components/add-messagesaudio/add-messagesaudio.component';

@Component({
  selector: 'app-messagesaudio',
  templateUrl: './messagesaudio.component.html',
  styleUrls: ['./messagesaudio.component.css'],
})
export class MessagesaudioComponent implements OnInit {
  messAudios: MessageAudio[] = [];

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
    this.reloadMessagesaudio();
  }

  reloadMessagesaudio() {
    this.loading = true;
    this.fileService
      .loadMessagesaudio()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((messaudioList) => {
        this.dataSource = new MatTableDataSource(messaudioList);
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

  addMessageaudio() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '600px';

    this.dialog
      .open(AddMessagesaudioComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadMessagesaudio();
        this.onSearchClear();
      });
  }

  deleteMessageaudio(messAudio: MessageAudio) {
    this.dialogService
      .openConfirmDialog('Are you sure you want to delete?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.fileService
            .deleteMessageaudio(messAudio.id, messAudio.fileName)
            .pipe(finalize(() => this.reloadMessagesaudio()))
            .subscribe();
        }
      });
  }
}
