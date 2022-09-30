import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { FileService } from '../../services/file.service';
import { DialogService } from '../../services/dialog.service';
import { Bibverses } from '../../models';
import { AddVersesComponent } from '../add-verses/add-verses.component';

@Component({
  selector: 'app-bibverses',
  templateUrl: './bibverses.component.html',
  styleUrls: ['./bibverses.component.css'],
})
export class BibversesComponent implements OnInit {
  verses: Bibverses[] = [];

  columnsToDisplay = ['reference', 'text', 'actions'];
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
    this.reloadVerses();
  }

  reloadVerses() {
    this.loading = true;
    this.fileService
      .loadVerses()
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

  addVerse() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '400px';

    this.dialog
      .open(AddVersesComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadVerses();
        this.onSearchClear();
      });
  }

  deleteVerse(verse: Bibverses) {
    this.dialogService
      .openConfirmDialog('Are you sure you want to delete?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.fileService
            .deleteVerse(verse.id!)
            .pipe(finalize(() => this.reloadVerses()))
            .subscribe();
        }
      });
  }
}
