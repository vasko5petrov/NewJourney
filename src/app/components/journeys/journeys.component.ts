import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-journeys',
  templateUrl: './journeys.component.html',
  styleUrls: ['./journeys.component.css']
})
export class JourneysComponent implements OnInit {
  journeys: any;
  search:any;
  maxRating: any = 5;
  journeysSubscribe: any;

  constructor(
    private af: AngularFire,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
  	this.af.auth.subscribe((user) => {
      if (user) {
        this.journeysSubscribe = this.firebaseService.getJourneys(user.uid).subscribe(journeys => {
          this.journeys = journeys;
        }, error => {
          console.log(error);
        });
      } else {
        this.journeysSubscribe.unsubscribe();
      }
    });
  }

  searchJourney(){
    this.af.auth.subscribe((user) => {
      if (user) {
        /*this.firebaseService.getJourneysByTitle(user.uid, this.search.toLowerCase()).subscribe(journeys => {
        this.journeys = journeys;
      }, error => {
          console.log(error);
        });*/
        this.firebaseService.getJourneysByQuery(user.uid, this.search.toLowerCase()).subscribe(journeys => {
        this.journeys = journeys;
      }, error => {
          console.log(error);
        });
      } else {
        this.journeysSubscribe.unsubscribe();
      }
    });

  }

  starArr(num) {
    var stars = new Array;

    for (var i = 0; i < num; i++) {
      stars.push(i);
    }

    return stars;
  }

}