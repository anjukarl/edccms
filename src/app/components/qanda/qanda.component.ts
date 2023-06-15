import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { FileService } from '../../services/file.service';
import { DialogService } from '../../services/dialog.service';
import { Qanda } from '../../models';
import { AddQandaComponent } from '../add-qanda/add-qanda.component';
import { EditQandaComponent } from '../edit-qanda/edit-qanda.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-qanda',
  templateUrl: './qanda.component.html',
  styleUrls: ['./qanda.component.css'],
})
export class QandaComponent implements OnInit {
  qandas: Qanda[] = [];

  columnsToDisplay = ['number', 'question', 'actions'];
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
    this.reloadQandas();
  }

  reloadQandas() {
    this.loading = true;
    this.fileService
      .loadQandas()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((qandaList) => {
        this.dataSource = new MatTableDataSource(qandaList);
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

  addQanda() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '800px';

    this.dialog
      .open(AddQandaComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadQandas();
        this.onSearchClear();
      });
  }

  editQanda(qanda: Qanda) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '800px';
    dialogConfig.data = qanda;

    this.dialog
      .open(EditQandaComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadQandas();
        this.onSearchClear();
      });
  }

  deleteQanda(qanda: Qanda) {
    this.dialogService
      .openConfirmDialog('Are you sure you want to delete?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.fileService
            .deleteQanda(qanda.id!)
            .pipe(finalize(() => this.reloadQandas()))
            .subscribe();
        }
      });
  }

  logout() {
    this.authService.signOut();
  }
}
