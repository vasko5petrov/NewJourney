import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { environment } from '../environments/environment';

import { FirebaseService } from './services/firebase.service';
import { AgmCoreModule } from "angular2-google-maps/core";

import { Daterangepicker } from 'ng2-daterangepicker';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { Ng2OrderModule } from 'ng2-order-pipe';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { JourneysComponent } from './components/journeys/journeys.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { JourneyComponent } from './components/journey/journey.component';
import { AddJourneyComponent } from './components/add-journey/add-journey.component';
import { EditJourneyComponent } from './components/edit-journey/edit-journey.component';
import { ImgLoaderComponent } from './components/img-loader/img-loader.component';

export const firebaseConfig = {
  apiKey: "AIzaSyAcPMIBOmjk1UpWaOHJ36q3F7DJLY2uDrc",
    authDomain: "new-journey.firebaseapp.com",
    databaseURL: "https://new-journey.firebaseio.com",
    projectId: "new-journey",
    storageBucket: "new-journey.appspot.com",
    messagingSenderId: "529111804461"
};

const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Popup
};

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'journeys', component: JourneysComponent},
  {path: 'journey/:id', component: JourneyComponent},
  {path: 'add-journey', component: AddJourneyComponent},
  {path: 'edit-journey/:id', component: EditJourneyComponent}
];
@Pipe({
    name: 'orderBy'
})
export class OrderBy{

 transform(array, orderBy, asc = true){

     if (!orderBy || orderBy.trim() == ""){
       return array;
     }

     //ascending
     if (asc){
       return Array.from(array).sort((item1: any, item2: any) => {
         return this.orderByComparator(item1[orderBy], item2[orderBy]);
       });
     }
     else{
       //not asc
       return Array.from(array).sort((item1: any, item2: any) => {
         return this.orderByComparator(item2[orderBy], item1[orderBy]);
       });
     }

 }

 orderByComparator(a:any, b:any):number{

     if((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))){
       //Isn't a number so lowercase the string to properly compare
       if(a.toLowerCase() < b.toLowerCase()) return -1;
       if(a.toLowerCase() > b.toLowerCase()) return 1;
     }
     else{
       //Parse strings as numbers to compare properly
       if(parseFloat(a) < parseFloat(b)) return -1;
       if(parseFloat(a) > parseFloat(b)) return 1;
      }

     return 0; //equal each other
 }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    JourneysComponent,
    NavbarComponent,
    JourneyComponent,
    AddJourneyComponent,
    EditJourneyComponent,
    ImgLoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    FlashMessagesModule,
    RouterModule.forRoot(appRoutes),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCS-RcG72Lw_QAkqewOKolhI5m2bCOG_5E",
      libraries: ["places"]
    }),
    Daterangepicker,
    Ng2Bs3ModalModule,
    Ng2OrderModule
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
