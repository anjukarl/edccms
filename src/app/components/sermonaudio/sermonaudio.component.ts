import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { Sermon } from '../../models';
import { FileService } from '../../services/file.service';
import { DialogService } from '../../services/dialog.service';
import { AddSermonsComponent } from '../../components/add-sermons/add-sermons.component';
import { EditSermonsComponent } from '../edit-sermons/edit-sermons.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sermonaudio',
  templateUrl: './sermonaudio.component.html',
  styleUrls: ['./sermonaudio.component.css'],
})
export class SermonaudioComponent implements OnInit {
  sermons: Sermon[] = [];

  columnsToDisplay = ['series', 'title', 'actions'];
  dataSource!: MatTableDataSource<any>;
  loading = false;
  searchKey: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fileService: FileService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.reloadSermons();
  }

  reloadSermons() {
    this.loading = true;
    this.fileService
      .loadSermons()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((trackList) => {
        this.dataSource = new MatTableDataSource(trackList);
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

  addSermon() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '600px';

    this.dialog
      .open(AddSermonsComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadSermons();
        this.onSearchClear();
      });
  }

  editSermon(sermon: Sermon) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '700px';
    dialogConfig.data = sermon;

    this.dialog
      .open(EditSermonsComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadSermons();
        this.onSearchClear();
      });
  }

  deleteSermon(sermon: Sermon) {
    this.dialogService
      .openConfirmDialog('Are you sure you want to delete?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.fileService
            .deleteSermon(sermon.id, sermon.fileName)
            .pipe(finalize(() => this.reloadSermons()))
            .subscribe();
        }
      });
  }

  logout() {
    this.authService.signOut();
  }
}
