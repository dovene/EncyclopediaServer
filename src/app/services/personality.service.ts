import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import 'rxjs/add/operator/toPromise';
import {Personality} from '../models/app-models';
import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})

export class PersonalityService {

  constructor(public firestore: AngularFirestore, public storage: AngularFireStorage) {}
  
  getPersonalities() : Observable<any> {
    
  let collectionRef = this.firestore.collection('personalities', ref => ref.orderBy('fullName', 'asc'));
   collectionRef.snapshotChanges().subscribe(res=>{
     console.log(res)
   })
    return collectionRef.snapshotChanges();
  }

  create(personality: Personality, imageFile: File){
    console.log('creation '+personality);
    let data = {
      fullName : personality.fullName,
      dateOfBirth : personality.dateOfBirth ? firestore.Timestamp.fromDate(personality.dateOfBirth) : null,
      dateOfDeath : personality.dateOfDeath ? firestore.Timestamp.fromDate(personality.dateOfDeath) : null,
      photoUrl: ""
    }
  if (imageFile!=null){
    const randomId = Math.random().toString(36).substring(2);
    // this.ref = this.afStorage.ref(randomId);
    // this.task = this.ref.put(event.target.files[0]);
     //const filePath = 'name-your-file-path-here';
     const fileRef = this.storage.ref(randomId);
     fileRef.put(imageFile);
     personality.photoUrl = randomId;
     data.photoUrl = randomId;
  } 
  return this.firestore.collection('personalities').add(data);

 }
 

 update(personality: Personality, imageFile: File): Promise<any>{
  console.log('update '+personality);
  let data = {
    fullName : personality.fullName,
    dateOfBirth : personality.dateOfBirth ? firestore.Timestamp.fromDate(personality.dateOfBirth) : null,
    dateOfDeath : personality.dateOfDeath ? firestore.Timestamp.fromDate(personality.dateOfDeath) : null,
    photoUrl: ""
  }
  if (imageFile!=null){
    const randomId = Math.random().toString(36).substring(2);
    // this.ref = this.afStorage.ref(randomId);
    // this.task = this.ref.put(event.target.files[0]);
     //const filePath = 'name-your-file-path-here';
     const fileRef = this.storage.ref(randomId);
     fileRef.put(imageFile);
     data.photoUrl = randomId;
  }
   return this.firestore.doc('personalities/' + personality.id).update(data);
}

delete(personality: Personality): Promise<any>{
   return this.firestore.doc('personalities/' + personality.id).delete()  
}

private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
}

}
