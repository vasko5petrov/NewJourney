import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseService } from '../../services/firebase.service';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import {} from '@types/googlemaps';

@Component({
  selector: 'app-journeys-map',
  templateUrl: './journeys-map.component.html',
  styleUrls: ['./journeys-map.component.css']
})
export class JourneysMapComponent implements OnInit {
  journeys: any;
  journeysSubscribe: any;
  public latitude: number;
  public longitude: number;
  //public searchControl: FormControl;
  public zoom: number;

  constructor(
    private af: AngularFire,
    private firebaseService: FirebaseService,
    private mapsAPILoader: MapsAPILoader,
  ) { }

  ngOnInit() {
    this.af.auth.subscribe((user) => {
      if (user) {
        this.journeysSubscribe = this.firebaseService.getJourneys(user.uid).subscribe(journeys => {
          this.journeys = journeys;
          this.zoom = 6;
          for (let i = 0; i < journeys.length; i++) {
            this.latitude = journeys[i].location.lat;
            this.longitude = journeys[i].location.lng;
          }
        }, error => {
          console.log(error);
        });
      } else {
        this.journeysSubscribe.unsubscribe();
      }
    });
  }

  clickedMarker(m: marker) {
    console.log("Clicked marker: " +m.name);
  }
  setMarkerIcon(m) {
    if (m.type === "Vacation") {
      return "assets/images/vacation_pin.png"
    } else if(m.type === "Job") {
      return "assets/images/job_pin.png"
    } else {
      return "assets/images/other_pin.png"
    }
  }

}

interface marker {
  name?:string;
  lat: number;
  lng:number;
  draggable: boolean;
}
