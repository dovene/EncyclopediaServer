import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import 'rxjs/add/operator/toPromise';
import {Country} from '../models/app-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CountryService {

  constructor(public firestore: AngularFirestore, public storage: AngularFireStorage) {}
  
  getCountries() : Observable<any> {
    let collectionRef = this.firestore.collection('countries', ref => ref.orderBy('name', 'asc'));
    return collectionRef.snapshotChanges();
  }

  createCountry(country: Country, imageFile: File){

  if (imageFile!=null){
    const randomId = Math.random().toString(36).substring(2);
    // this.ref = this.afStorage.ref(randomId);
    // this.task = this.ref.put(event.target.files[0]);
     //const filePath = 'name-your-file-path-here';
     const fileRef = this.storage.ref(randomId);
     fileRef.put(imageFile);
     country.imageUrl = randomId;
  } 
  return this.firestore.collection('countries').add(country);

 }
 

 updateCountry(country: Country, imageFile: File): Promise<any>{
  if (imageFile!=null){
    const randomId = Math.random().toString(36).substring(2);
    // this.ref = this.afStorage.ref(randomId);
    // this.task = this.ref.put(event.target.files[0]);
     //const filePath = 'name-your-file-path-here';
     const fileRef = this.storage.ref(randomId);
     fileRef.put(imageFile);
     country.imageUrl = randomId;
  }
   return this.firestore.doc('countries/' + country.id).update(country);
}

deleteCountry(country: Country): Promise<any>{
   return this.firestore.doc('countries/' + country.id).delete()  
}

private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
}

}
