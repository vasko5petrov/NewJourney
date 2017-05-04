import { Component, ElementRef, NgModule, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FirebaseService } from '../../services/firebase.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as firebase from 'firebase';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import {} from '@types/googlemaps';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css']
})
export class JourneyComponent implements OnInit {
  public latitude: number;
  public longitude: number;
  //public searchControl: FormControl;
  public zoom: number;

  id: any;
  journey: any;
  journeySubscribe: any;
  maxRating: any;

  constructor(
    private af: AngularFire,
    public flashMessage: FlashMessagesService,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.maxRating = 5;
    this.id = this.route.snapshot.params['id'];
    this.af.auth.subscribe((user) => {
      if (user) {
        this.journeySubscribe = this.firebaseService.getJourneyDetails(user.uid, this.id).subscribe(journey => {
          this.journey = journey;
          this.zoom = 12;
          if(this.journey.location.lat !== undefined) {
            this.latitude = this.journey.location.lat;
            this.longitude = this.journey.location.lng;
          } else {
            console.log("lat is not defined");
          }
        }, error => {
          console.log(error);
        });
      } else {
        this.journeySubscribe.unsubscribe();
      }
    });
  }

  deleteJourney() {
    this.flashMessage.show(
      'Journey '+this.journey.title+' was deleted.',
      {cssClass:'alert-success',timeout: 3000}
    );
    this.journeySubscribe.unsubscribe();
    this.firebaseService.deleteJourney(this.journey);

    this.router.navigateByUrl('/journeys');
  }

  starArr(num) {
    var stars = new Array;

    for (var i = 0; i < num; i++) {
      stars.push(i);
    }

    return stars;
  }

}
