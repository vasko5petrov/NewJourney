import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as firebase from 'firebase';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FirebaseService {
  journeys: FirebaseListObservable<any[]>;
  journey: FirebaseObjectObservable<any>;
  folder: any;

  constructor(
    private af: AngularFire
  ) {
    this.folder = "journeyimages";
  }

  getJourneys(userId) {
    this.journeys = this.af.database.list('/journeys/'+ userId) as FirebaseListObservable<Journey[]>
    return this.journeys;
  }

  getJourneysByQuery(userId, query: any): Observable<Journey[]> {
    return this.af.database.list('/journeys/'+ userId)
      .map(_journeys => _journeys.filter(journey => journey.title.toLowerCase().indexOf(query) !== -1 || journey.location.name.toLowerCase().indexOf(query) !== -1 ));
  }

  getJourneyDetails(userId, id) {
    this.journey = this.af.database.object('/journeys/'+ userId +'/'+ id) as FirebaseObjectObservable<Journey>;
    return this.journey;
  }
  
  addJourney(userId, journey) {
    let storageRef = firebase.storage().ref();
    let imageFile = (<HTMLInputElement>document.getElementById('image')).files[0];

    if (imageFile) {
      let rand = new Date().getTime();
      let path = `/${this.folder}/${userId}/${rand}_${imageFile.name}`;
      storageRef.child(path).put(imageFile).then((snapshot) => {
        journey.imagePath = path;
        this.getImageURL(path).then((url) => {
          journey.imageUrl = url;
          this.journeys.push(journey);
        });
      });
    }

  }

  updateJourney(userId, journey) {

    let storageRef = firebase.storage().ref();
    // get image file from input
    let imageFile = (<HTMLInputElement>document.getElementById('image')).files[0];

    // if is a new image
    if (imageFile) {

      // delete existing image from firebase storage
      storageRef.child(journey.imagePath).delete();

      // add new image
      // create a rand
      let imgId = new Date().getTime();
      // define path by user to storage image
      let path = `/${this.folder}/${userId}/${imgId}_${imageFile.name}`;
      // create a reference from firebase storage
      let iRef = storageRef.child(path);

      // update listing with new imagePath and imageUrl
      iRef.put(imageFile).then((snapshot) => {
        // get new image url from firebase storage
        this.getImageURL(path).then((url) => {
          // define new path
          journey.imagePath = path;
          // define new url
          journey.imageUrl = url;
          // update listing
          this.journey.update(journey);
        });
      });

    } else {
      // update listing
      this.journey.update(journey);
    }
  }

  deleteJourney(journey) {
    // remove image from firebase storage
    let storageRef = firebase.storage().ref();
    storageRef.child(journey.imagePath).delete();
    // remove listing from firebase database
    this.journey.remove();
  }

  getImageURL(path) {
    // get image url from firebase storage
    let storageRef = firebase.storage().ref();
    return storageRef.child(path).getDownloadURL();
  }

}

// listing interface
interface Journey {
  $key: any;
  title: any;
  location: any;
  duration: any;
  type: any;
  rating: any;
  imagePath: any;
  imageUrl: any;
}
