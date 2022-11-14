import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AddTracksComponent } from './components/add-tracks/add-tracks.component';
import { MaterialModule } from './material.module';
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

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'bibverses', component: BibversesComponent },
  { path: 'dailyword', component: DailywordComponent },
  { path: 'getfromyt', component: GetfromytComponent },
  { path: 'qanda', component: QandaComponent },
  { path: 'wtbaudio', component: WtbaudioComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    MaterialModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    AngularEditorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
