import { Component, ElementRef, NgModule, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import {} from '@types/googlemaps';
import { DaterangepickerConfig } from 'ng2-daterangepicker';

@Component({
  selector: 'app-add-journey',
  templateUrl: './add-journey.component.html',
  styleUrls: ['./add-journey.component.css']
})
export class AddJourneyComponent implements OnInit {
  public daterange: any = {};
  diffDays: any;
  public options: any = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: false,
  };

  public selectedDate(value: any) {
      this.daterange.start = value.start;
      this.daterange.end = value.end;
      this.daterange.label = value.label;
      this.diffDays = Math.round(Math.abs((value.start - value.end)/(24*60*60*1000)));
  }

  public latitude: number;
  public longitude: number;
  //public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  userId: any;

  title: any ;
  location: any;
  duration: any;
  type: any;
  rating: any;
  imageUrl: any;

  imgReader: string;
  validImage: boolean;
  validSubmit: boolean;

  constructor(
    private af: AngularFire,
    public flashMessage: FlashMessagesService,
    private firebaseService: FirebaseService,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private daterangepickerOptions: DaterangepickerConfig
  ) {
    this.daterangepickerOptions.settings = {
        locale: { format: 'YYYY-MM-DD' },
        alwaysShowCalendars: false
    };
  }

  ngOnInit() {
    this.af.auth.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //create search FormControl
    //this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

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

        });
      });
    });
      } else {
        this.userId = null;
      }
    });
    this.validImage = true;
    this.validSubmit = false;
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  onAddSubmit() {
    this.duration = {
      days: this.diffDays,
      dateLabel: this.daterange.start.format('YYYY-MM-DD') + ' - ' + this.daterange.end.format('YYYY-MM-DD')
    };
    let journey = {
      title: this.title,
      location: this.location,
      duration: this.duration,
      type: this.type,
      rating: this.rating,
      imageUrl: this.imageUrl
    }
    this.firebaseService.addJourney(this.userId, journey);
    this.flashMessage.show(
      'Journey '+journey.title+' was created.',
      {cssClass:'alert-success',timeout: 6000}
    );
    this.router.navigateByUrl('/journeys');
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

}
