import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import {
  VidPlaylist,
  VidPlaylistItems,
  YTPlaylist,
  Videos,
} from './../../models';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-getytdata',
  templateUrl: './getytdata.component.html',
  styleUrls: ['./getytdata.component.css'],
})
export class GetytdataComponent implements OnInit {
  playlists: YTPlaylist[] = [];
  videos: Videos[] = [];
  nextPage = '';
  status = '';

  yurl = 'https://youtube.googleapis.com/youtube/v3/playlists?part=snippet';
  yurl2 =
    'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet';
  channel = 'UCrLto6D2j-23YrIb3wrp_kA';
  ky = 'AIzaSyA7tSfgvo9iMlmZpENiWxpWtLqEHyLXJ8w';
  playlistId = '';

  pms = new HttpParams().set('channelId', this.channel).set('key', this.ky);
  pms2 = new HttpParams().set('key', this.ky);

  constructor(private http: HttpClient, private fileService: FileService) {}

  ngOnInit(): void {
    this.status = 'Getting playlists...';
    this.getPlaylistLoop();
  }

  /*
    Getting playlists and updating database
  */

  async getPlaylistLoop() {
    let count = 0;
    do {
      if (this.nextPage.length > 0) {
        this.addNextToParams(this.nextPage);
      }
      this.getPlaylists();
      await this.delay(1000);
      count++;
    } while (this.nextPage.length > 0);
    this.status = 'Getting playlists completed!';
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
        for (var _i = 0; _i < res.items.length; _i++) {
          const plid = res.items[_i].id;
          const vtitle = res.items[_i].snippet.title;
          const vdescription = res.items[_i].snippet.description;
          const vtn = res.items[_i].snippet.thumbnails.default.url;
          this.playlists.push({
            title: vtitle,
            description: vdescription,
            thumbnail: vtn,
            playlistId: plid,
          });
        }
      });
  }

  addPlaylists() {
    this.fileService.createYTPlaylist(this.playlists).then(() => {
      this.status = 'Playlist process completed!';
    });
  }

  /*
    Getting videos and updating database
  */

  async getVideos() {
    for (var _i = 0; _i < this.playlists.length; _i++) {
      this.playlistId = this.playlists[_i].playlistId;
      this.pms2 = new HttpParams()
        .set('key', this.ky)
        .set('playlistId', this.playlistId);
      let count = 0;
      do {
        if (this.nextPage.length > 0) {
          this.addNextToParams2(this.nextPage);
        }
        this.getPlaylistItems();
        await this.delay(1000);
        count++;
      } while (this.nextPage.length > 0);
    }
    this.status = 'Getting videos completed!';
  }

  addNextToParams2(np: string) {
    this.pms2 = new HttpParams()
      .set('key', this.ky)
      .set('playlistId', this.playlistId)
      .set('pageToken', np);
  }

  getPlaylistItems() {
    this.http
      .get<VidPlaylistItems>(this.yurl2, { params: this.pms2 })
      .subscribe((res) => {
        if (res.nextPageToken) {
          this.nextPage = res.nextPageToken;
        } else {
          this.nextPage = '';
        }
        for (var _i = 0; _i < res.items.length; _i++) {
          const videoId = res.items[_i].snippet.resourceId.videoId;
          const vtitle = res.items[_i].snippet.title;
          const vtn = res.items[_i].snippet.thumbnails.default.url;
          const plId = res.items[_i].snippet.playlistId;
          this.videos.push({
            title: vtitle,
            thumbnail: vtn,
            playlistId: plId,
            videoId: videoId,
          });
        }
      });
  }

  addVideos() {
    this.fileService.createVideos(this.videos).then(() => {
      this.status = 'Process completed!';
    });
  }

  /*
    Common functions
  */

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
