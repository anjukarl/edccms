import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Track } from './models';
import { FileService } from './services/file.service';
import { finalize } from 'rxjs';
import { AddTracksComponent } from './components/add-tracks/add-tracks.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  tracks: Track[] = [];

  columnsToDisplay = ['book', 'name', 'duration', 'actions'];
  dataSource!: MatTableDataSource<any>;
  loading = false;
  searchKey: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fileService: FileService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.reloadTracks();
  }

  reloadTracks() {
    this.loading = true;
    this.fileService
      .loadTracks()
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

  addTrack() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '400px';

    // dialogConfig.data = this.caseId;

    this.dialog
      .open(AddTracksComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.reloadTracks();
      });
  }

  editTrack(track: Track) {
    alert('Feature not ready!');
  }

  deleteTrack(track: Track) {
    alert('Feature not ready!');
  }
}
