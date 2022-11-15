import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { FileService } from '../../services/file.service';
import { DialogService } from '../../services/dialog.service';
import { Songs } from '../../models';
import { AddSongsComponent } from '../add-songs/add-songs.component';
import { EditSongsComponent } from '../edit-songs/edit-songs.component';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
})
export class SongsComponent implements OnInit {
  columnsToDisplay = ['title', 'actions'];
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
    this.reloadSongs();
  }

  reloadSongs() {
    this.loading = true;
    this.fileService
      .loadSongs()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((songsList) => {
        this.dataSource = new MatTableDataSource(songsList);
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

  addSong() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '600px';

    this.dialog
      .open(AddSongsComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadSongs();
        this.onSearchClear();
      });
  }

  updateSong(song: Songs) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '600px';
    dialogConfig.data = song;

    this.dialog
      .open(EditSongsComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadSongs();
        this.onSearchClear();
      });
  }

  deleteSong(song: Songs) {
    this.dialogService
      .openConfirmDialog('Are you sure you want to delete?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.fileService
            .deleteSongs(song.id!)
            .pipe(finalize(() => this.reloadSongs()))
            .subscribe();
        }
      });
  }
}
