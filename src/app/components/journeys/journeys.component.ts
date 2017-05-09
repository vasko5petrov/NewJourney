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
  sort: any;
  order = "date";
  option = true;
  nCnt: number = 0;

  typeOtherPercent: any;
  typeVacationPercent: any;
  typeJobPercent: any;

  private journeysPercent() {
    let totalJourneys = this.journeys.length;
    let typeOther = 0, typeVacation = 0, typeJob = 0;
    for (let i = 0; i < totalJourneys; i++) {
      if(this.journeys[i].type === "Other") {
        typeOther++;
      } else if(this.journeys[i].type === "Vacation") {
        typeVacation++;
      } else if(this.journeys[i].type === "Job") {
        typeJob++;
      }
    }
    if(totalJourneys === 0) {
      this.typeOtherPercent = this.typeVacationPercent = this.typeJobPercent = "0%";
    } else {
      this.typeOtherPercent = Math.floor((typeOther/totalJourneys)*100) + "%";
      this.typeVacationPercent = Math.floor((typeVacation/totalJourneys)*100) + "%";
      this.typeJobPercent = Math.floor((typeJob/totalJourneys)*100) + "%";
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
