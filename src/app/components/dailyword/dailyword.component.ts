import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { FileService } from '../../services/file.service';
import { DialogService } from '../../services/dialog.service';
import { DailyWord } from '../../models';
import { AddDwComponent } from '../add-dw/add-dw.component';
import { EditDwComponent } from '../edit-dw/edit-dw.component';

@Component({
  selector: 'app-dailyword',
  templateUrl: './dailyword.component.html',
  styleUrls: ['./dailyword.component.css'],
})
export class DailywordComponent implements OnInit {
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
    this.reloadDword();
  }

  reloadDword() {
    this.loading = true;
    this.fileService
      .loadDword()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((dwordList) => {
        this.dataSource = new MatTableDataSource(dwordList);
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

  addDword() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '600px';

    this.dialog
      .open(AddDwComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadDword();
        this.onSearchClear();
      });
  }

  updateDword(dword: DailyWord) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '600px';
    dialogConfig.data = dword;

    this.dialog
      .open(EditDwComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadDword();
        this.onSearchClear();
      });
  }

  deleteDword(dword: DailyWord) {
    this.dialogService
      .openConfirmDialog('Are you sure you want to delete?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.fileService
            .deleteDword(dword.id!)
            .pipe(finalize(() => this.reloadDword()))
            .subscribe();
        }
      });
  }
}
