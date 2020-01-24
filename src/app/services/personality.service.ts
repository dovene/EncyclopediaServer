import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import 'rxjs/add/operator/toPromise';
import {Topic} from '../models/app-models';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalityService {

  constructor(public firestore: AngularFirestore, public storage: AngularFireStorage) {}
  getTopics() {
    let collectionRef = this.firestore.collection('topics', ref => ref.orderBy('name', 'asc'));
    
    return collectionRef.snapshotChanges();
  }

createTopicWithImage(topic: Topic, imageFile: File){

  if (imageFile!=null){
    const randomId = Math.random().toString(36).substring(2);
    // this.ref = this.afStorage.ref(randomId);
    // this.task = this.ref.put(event.target.files[0]);
     //const filePath = 'name-your-file-path-here';
     const fileRef = this.storage.ref(randomId);
   
     fileRef.put(imageFile);
   
   
     topic.imageUrl = randomId;
  }
 
  return this.firestore.collection('topics').add(topic);
 
 }
 
 createTopic(topic: Topic){
  return this.firestore.collection('topics').add(topic);
}

 updateTopic(topic: Topic, imageFile: File): Promise<any>{
  if (imageFile!=null){
    const randomId = Math.random().toString(36).substring(2);
    // this.ref = this.afStorage.ref(randomId);
    // this.task = this.ref.put(event.target.files[0]);
     //const filePath = 'name-your-file-path-here';
     const fileRef = this.storage.ref(randomId);
   
     fileRef.put(imageFile);
   
   
     topic.imageUrl = randomId;
  }
 
   return this.firestore.doc('topics/' + topic.id).update(topic);
}

deleteTopic(topic: Topic): Promise<any>{
   return this.firestore.doc('topics/' + topic.id).delete()  
}

private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
}

}
