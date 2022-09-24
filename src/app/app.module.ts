import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AddTracksComponent } from './components/add-tracks/add-tracks.component';
import { MaterialModule } from './material.module';
import { HomeComponent } from './components/home/home.component';
import { WtbaudioComponent } from './components/wtbaudio/wtbaudio.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
