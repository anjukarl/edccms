import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { VidPlaylist, YTPlaylist } from './../../models';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-getytdata',
  templateUrl: './getytdata.component.html',
  styleUrls: ['./getytdata.component.css'],
})
export class GetytdataComponent implements OnInit {
  videos: YTPlaylist[] = [];
  nextPage = '';
  status = '';

  yurl = 'https://youtube.googleapis.com/youtube/v3/playlists?part=snippet';
  yurl2 = '';
  channel = 'UCrLto6D2j-23YrIb3wrp_kA';
  ky = 'AIzaSyA7tSfgvo9iMlmZpENiWxpWtLqEHyLXJ8w';

  pms = new HttpParams().set('channelId', this.channel).set('key', this.ky);

  constructor(private http: HttpClient, private fileService: FileService) {}

  ngOnInit(): void {
    this.status = 'Getting playlists...';
    this.getPlaylistLoop();
  }

  addPlaylists() {
    this.fileService.createYTPlaylist(this.videos).then(() => {
      this.status = 'Playlist process completed!';
    });
  }

  async getPlaylistLoop() {
    let count = 0;
    do {
      if (this.nextPage.length > 0) {
        this.addNextToParams(this.nextPage);
      }
      this.getPlaylists();
      await this.delay(1000);
      count++;
      console.log('Count: ', count);
      console.log('Next page: ', this.nextPage);
    } while (this.nextPage.length > 0);
    this.status = 'Getting playlists completed!';
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  addNextToParams(np: string) {
    this.pms = new HttpParams()
      .set('channelId', this.channel)
      .set('key', this.ky)
      .set('pageToken', np);
  }

  getPlaylists() {
    this.http
      .get<VidPlaylist>(this.yurl, { params: this.pms })
      .subscribe((res) => {
        if (res.nextPageToken) {
          this.nextPage = res.nextPageToken;
        } else {
          this.nextPage = '';
        }
        console.log('This-next-page: ', this.nextPage);
        for (var _i = 0; _i < res.items.length; _i++) {
          const plid = res.items[_i].id;
          const vtitle = res.items[_i].snippet.title;
          const vdescription = res.items[_i].snippet.description;
          const vtn = res.items[_i].snippet.thumbnails.default.url;
          this.videos.push({
            title: vtitle,
            description: vdescription,
            thumbnail: vtn,
            playlistId: plid,
          });
        }
      });
  }

  getVideos() {
    this.status = 'Process completed!';
  }
}
