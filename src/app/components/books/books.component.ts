import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { Bookpdf } from '../../models';
import { FileService } from '../../services/file.service';
import { DialogService } from '../../services/dialog.service';
import { AddBooksComponent } from '../../components/add-books/add-books.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {
  columnsToDisplay = ['author', 'title', 'actions'];
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
    this.reloadBookpdfs();
  }

  reloadBookpdfs() {
    this.loading = true;
    this.fileService
      .loadBookpdfs()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((bookpdfs) => {
        this.dataSource = new MatTableDataSource(bookpdfs);
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

  addBookpdf() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '600px';

    this.dialog
      .open(AddBooksComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadBookpdfs();
        this.onSearchClear();
      });
  }

  deleteBookpdf(bookpdf: Bookpdf) {
    this.dialogService
      .openConfirmDialog('Are you sure you want to delete?')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.fileService
            .deleteBookpdf(bookpdf.id!, bookpdf.filename, bookpdf.thumbname)
            .pipe(finalize(() => this.reloadBookpdfs()))
            .subscribe();
        }
      });
  }

  logout() {
    this.authService.signOut();
  }
}
