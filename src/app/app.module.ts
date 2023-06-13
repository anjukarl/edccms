import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AddTracksComponent } from './components/add-tracks/add-tracks.component';
import { HomeComponent } from './components/home/home.component';
import { WtbaudioComponent } from './components/wtbaudio/wtbaudio.component';
import { GetfromytComponent } from './components/getfromyt/getfromyt.component';
import { BibversesComponent } from './components/bibverses/bibverses.component';
import { AddVersesComponent } from './components/add-verses/add-verses.component';
import { QandaComponent } from './components/qanda/qanda.component';
import { AddQandaComponent } from './components/add-qanda/add-qanda.component';
import { DailywordComponent } from './components/dailyword/dailyword.component';
import { AddDwComponent } from './components/add-dw/add-dw.component';
import { EditQandaComponent } from './components/edit-qanda/edit-qanda.component';
import { EditDwComponent } from './components/edit-dw/edit-dw.component';
import { BooksComponent } from './components/books/books.component';
import { AddBooksComponent } from './components/add-books/add-books.component';
import { EditBooksComponent } from './components/edit-books/edit-books.component';
import { SongsComponent } from './components/songs/songs.component';
import { AddSongsComponent } from './components/add-songs/add-songs.component';
import { EditSongsComponent } from './components/edit-songs/edit-songs.component';
import { MessagesComponent } from './components/messages/messages.component';
import { AddMessagesComponent } from './components/add-messages/add-messages.component';
import { EditMessagesComponent } from './components/edit-messages/edit-messages.component';
import { SermonaudioComponent } from './components/sermonaudio/sermonaudio.component';
import { SermonseriesComponent } from './components/sermonseries/sermonseries.component';
import { AddSeriesComponent } from './components/add-series/add-series.component';
import { EditSeriesComponent } from './components/edit-series/edit-series.component';
import { AddSermonsComponent } from './components/add-sermons/add-sermons.component';
import { EditSermonsComponent } from './components/edit-sermons/edit-sermons.component';
import { MessagesaudioComponent } from './components/messagesaudio/messagesaudio.component';
import { AddMessagesaudioComponent } from './components/add-messagesaudio/add-messagesaudio.component';
import { GetytdataComponent } from './components/getytdata/getytdata.component';
import { LoginComponent } from './components/login/login.component';
import { GuardService } from './services/guard.service';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [GuardService],
  },
  {
    path: 'bibverses',
    component: BibversesComponent,
    canActivate: [GuardService],
  },
  {
    path: 'books',
    component: BooksComponent,
    canActivate: [GuardService],
  },
  {
    path: 'dailyword',
    component: DailywordComponent,
    canActivate: [GuardService],
  },
  // { path: 'getfromyt', component: GetfromytComponent },
  {
    path: 'getytdata',
    component: GetytdataComponent,
    canActivate: [GuardService],
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [GuardService],
  },
  {
    path: 'messagesaudio',
    component: MessagesaudioComponent,
    canActivate: [GuardService],
  },
  { path: 'qanda', component: QandaComponent, canActivate: [GuardService] },
  { path: 'songs', component: SongsComponent, canActivate: [GuardService] },
  {
    path: 'wtbaudio',
    component: WtbaudioComponent,
    canActivate: [GuardService],
  },
  {
    path: 'sermonaudio',
    component: SermonaudioComponent,
    canActivate: [GuardService],
  },
  {
    path: 'sermonseries',
    component: SermonseriesComponent,
    canActivate: [GuardService],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
    AddTracksComponent,
    HomeComponent,
    WtbaudioComponent,
    GetfromytComponent,
    BibversesComponent,
    AddVersesComponent,
    QandaComponent,
    AddQandaComponent,
    DailywordComponent,
    AddDwComponent,
    EditQandaComponent,
    EditDwComponent,
    BooksComponent,
    AddBooksComponent,
    EditBooksComponent,
    SongsComponent,
    AddSongsComponent,
    EditSongsComponent,
    MessagesComponent,
    AddMessagesComponent,
    EditMessagesComponent,
    SermonaudioComponent,
    SermonseriesComponent,
    AddSeriesComponent,
    EditSeriesComponent,
    AddSermonsComponent,
    EditSermonsComponent,
    MessagesaudioComponent,
    AddMessagesaudioComponent,
    GetytdataComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule,
    MaterialModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    AngularEditorModule,
  ],
  providers: [GuardService, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
