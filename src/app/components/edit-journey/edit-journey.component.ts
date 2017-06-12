import { Component, ElementRef, NgModule, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FirebaseService } from '../../services/firebase.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as firebase from 'firebase';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import {} from '@types/googlemaps';
import { DaterangepickerConfig } from 'ng2-daterangepicker';

@Component({
  selector: 'app-edit-journey',
  templateUrl: './edit-journey.component.html',
  styleUrls: ['./edit-journey.component.css']
})
export class EditJourneyComponent implements OnInit {
  public daterange: any = {};
  diffDays: any;
  dateLabel: any;
  public options: any = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: false,
  };

  public selectedDate(value: any) {
      this.daterange.start = value.start;
      this.daterange.end = value.end;
      this.daterange.label = value.label;
      this.diffDays = Math.round(Math.abs((value.start - value.end)/(24*60*60*1000)));
      this.dateLabel = this.daterange.start.format('YYYY-MM-DD') + ' - ' + this.daterange.end.format('YYYY-MM-DD');
      this.journey.duration.days = this.diffDays;
      this.journey.duration.dateLabel = this.dateLabel;
  }

  public latitude: number;
  public longitude: number;
  //public searchControl: FormControl;
  public zoom: number;

  @ViewChild("editSearch")
  public searchElementRef: ElementRef;

  userId: any;
  id: any;
  journey: any;
  journeySubscribe: any;
  location: any;
  imgReader: string;
  validImage: boolean;
  validSubmit: boolean;

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
    this.id = this.route.snapshot.params['id'];
    this.imgReader = null;
    this.validImage = true;
    this.validSubmit = true;

    this.af.auth.subscribe((user) => {
      if (user) {
        this.userId = user.uid;

    //create search FormControl
    //this.searchControl = new FormControl();

    //set current position
    //this.setCurrentPosition();


        this.journeySubscribe = this.firebaseService.getJourneyDetails(this.userId, this.id).subscribe(journey => {
          this.journey = journey;
          console.log(this.journey);

          //load Places Autocomplete
          this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
            autocomplete.addListener("place_changed", () => {
              this.ngZone.run(() => {
                //get the place result
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                //verify result
                if (place.geometry === undefined || place.geometry === null) {
                  return;
                }

                //set latitude, longitude and zoom
                this.latitude = place.geometry.location.lat();
                this.longitude = place.geometry.location.lng();
                this.zoom = 12;

                this.location = {
                  name: place["formatted_address"],
                  lat: this.latitude,
                  lng: this.longitude
                };
                this.journey.location = this.location;

              });
            });
          });
        }, error => {
          console.log(error);
        });


      } else {
        this.journeySubscribe.unsubscribe();
      }
    });
  }

  /*private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }*/

  onEditSubmit() {
    let journey = {
      title: this.journey.title,
      location: this.journey.location,
      duration: this.journey.duration,
      type: this.journey.type,
      rating: this.journey.rating,
      imageUrl: this.journey.imageUrl,
      imagePath: this.journey.imagePath
    }

    this.firebaseService.updateJourney(this.userId, journey);
    this.flashMessage.show(
      'Journey '+this.journey.title+' was edited.',
      {cssClass:'alert-success',timeout: 6000}
    );
    this.router.navigateByUrl('/journey/'+ this.id);
  }

  verifyImg(image) {
    let img = image.files[0];
    let limitSize = 2 * 1024 * 1024;

    if (img) {
      if (img.size > limitSize) {
        this.validImage = false;
        this.validSubmit = false;
      } else {
        let reader = new FileReader();
        reader.onload = () => {
          this.imgReader = reader.result;
        }
        reader.readAsDataURL(img);
        this.validImage = true;
        this.validSubmit = true;
      }
    } else {
      this.imgReader = null;
      this.validImage = true;
      this.validSubmit = true;
    }
  }

  goBack() {
    this.router.navigateByUrl('/journey/'+ this.id);
  }

}
