import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';

import { AppComponent } from './app.component';
import { AvatarDialogComponent } from './avatar-dialog/avatar-dialog.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditUserResolver } from './edit-user/edit-user.resolver';
import { NewUserComponent } from './new-user/new-user.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';

import { environment } from '../environments/environment';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatInputModule, MatSliderModule, MatDialogModule } from '@angular/material';
import { WelcomeComponent } from './welcome/welcome.component';
import { TopicComponent } from './topic/topic.component';
import { CountryComponent } from './country/country.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FirebaseService } from './services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';

import {ModalDialogComponent} from '../app/modal-dialog/modal-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AvatarDialogComponent,
    EditUserComponent,
    NewUserComponent,
    HomeComponent,
    WelcomeComponent,
    TopicComponent,
    CountryComponent,
    ModalDialogComponent
  ],
  entryComponents: [AvatarDialogComponent, ModalDialogComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
  
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatDialogModule
  ],
  providers: [FirebaseService, EditUserResolver],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
