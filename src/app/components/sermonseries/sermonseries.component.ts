import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { FileService } from '../../services/file.service';
import { DialogService } from '../../services/dialog.service';
import { Series } from '../../models';
import { AddSeriesComponent } from '../add-series/add-series.component';
import { EditSeriesComponent } from '../edit-series/edit-series.component';

@Component({
  selector: 'app-sermonseries',
  templateUrl: './sermonseries.component.html',
  styleUrls: ['./sermonseries.component.css'],
})
export class SermonseriesComponent implements OnInit {
  series: Series[] = [];

  columnsToDisplay = ['text', 'actions'];
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
    this.reloadSeries();
  }

  reloadSeries() {
    this.loading = true;
    this.fileService
      .loadSeries()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((versesList) => {
        this.dataSource = new MatTableDataSource(versesList);
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

  addSeries() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '400px';

    this.dialog
      .open(AddSeriesComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadSeries();
        this.onSearchClear();
      });
  }

  editSeries(qanda: Series) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '600px';
    dialogConfig.data = qanda;

    this.dialog
      .open(EditSeriesComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadSeries();
        this.onSearchClear();
      });
  }

  deleteSeries(series: Series) {
    this.dialogService
      .openConfirmDialog('Are you sure you want to delete?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.fileService
            .deleteSeries(series.id!)
            .pipe(finalize(() => this.reloadSeries()))
            .subscribe();
        }
      });
  }
}
