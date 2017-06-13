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
  journeysSubscribe: any;
  search:any;
  maxRating: any = 5;
  sort: any;
  order = "date";
  option = true;
  nCnt: number = 0;

  typeSeaPercent: any;
  typeSpaPercent: any;
  typeMountainPercent: any;
  typeMonumentsPercent: any;

  itemsPerPage: any = 8;

  private journeysPercent() {
    let totalJourneys = this.journeys.length;
    let typeSea = 0, typeSpa = 0, typeMountain = 0, typeMonuments = 0;
    for (let i = 0; i < totalJourneys; i++) {
      if(this.journeys[i].type === "Sea") {
        typeSea++;
      } else if(this.journeys[i].type === "Spa") {
        typeSpa++;
      } else if(this.journeys[i].type === "Mountain") {
        typeMountain++;
      } else if(this.journeys[i].type === "Monuments") {
        typeMonuments++;
      }
    }
    if(totalJourneys === 0) {
      this.typeSeaPercent = this.typeSpaPercent = this.typeMountainPercent = this.typeMonumentsPercent = "0%";
    } else {
      this.typeSeaPercent = Math.floor((typeSea/totalJourneys)*100) + "%";
      this.typeSpaPercent = Math.floor((typeSpa/totalJourneys)*100) + "%";
      this.typeMountainPercent = Math.floor((typeMountain/totalJourneys)*100) + "%";
      this.typeMonumentsPercent = Math.floor((typeMonuments/totalJourneys)*100) + "%";
    }
  }

  constructor(
    private af: AngularFire,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
  	this.af.auth.subscribe((user) => {
      if (user) {
        this.journeysSubscribe = this.firebaseService.getJourneys(user.uid).subscribe(journeys => {
          this.journeys = journeys;
          this.journeysPercent();
        }, error => {
          console.log(error);
        });
      } else {
        this.journeysSubscribe.unsubscribe();
      }
    });
  }
  sortBy(name){
    this.order = name;
    this.nCnt = this.nCnt + 1;
    if(this.nCnt%2) {
      this.option = true;
    } else {
      this.option = false;
    }
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
        this.journeysPercent();
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
