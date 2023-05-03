import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { VidData, Videos } from './../../models';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-getfromyt',
  templateUrl: './getfromyt.component.html',
  styleUrls: ['./getfromyt.component.css'],
})
export class GetfromytComponent implements OnInit {
  videos: Videos[] = [];
  nextPage = '';
  status = '';

  yurl = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet';
  channel = 'UCrLto6D2j-23YrIb3wrp_kA';
  ky = 'AIzaSyA7tSfgvo9iMlmZpENiWxpWtLqEHyLXJ8w';

  pms = new HttpParams()
    .set('channelId', this.channel)
    .set('type', 'video')
    .set('key', this.ky);

  constructor(private http: HttpClient, private fileService: FileService) {}

  ngOnInit(): void {
    this.status = 'Getting videos from YouTube channel...';
    this.getVideoLoop();
  }

  addVideos() {
    this.fileService.createVideos(this.videos).then(() => {
      this.status = 'Process completed!';
    });
  }

  async getVideoLoop() {
    let count = 0;
    do {
      if (this.nextPage.length > 0) {
        this.addNextToParams(this.nextPage);
      }
      this.getVideos();
      await this.delay(1000);
      count++;
      console.log('Count: ', count);
      console.log('Next page: ', this.nextPage);
    } while (this.nextPage.length > 0);
    this.status = 'Getting videos completed!';
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getVideos() {
    this.http.get<VidData>(this.yurl, { params: this.pms }).subscribe((res) => {
      if (res.nextPageToken) {
        this.nextPage = res.nextPageToken;
      } else {
        this.nextPage = '';
      }
      console.log('This-next-page: ', this.nextPage);
      for (var _i = 0; _i < res.items.length; _i++) {
        const vurl = res.items[_i].id.videoId;
        const vtitle = res.items[_i].snippet.title;
        const vtn = res.items[_i].snippet.thumbnails.default.url;
        this.videos.push({
          videoId: vurl,
          title: vtitle,
          thumbnail: vtn,
          playlistId: '',
        });
      }
    });
  }

  addNextToParams(np: string) {
    this.pms = new HttpParams()
      .set('channelId', this.channel)
      .set('type', 'video')
      .set('key', this.ky)
      .set('pageToken', np);
  }
}
