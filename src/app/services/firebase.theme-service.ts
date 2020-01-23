import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {Theme} from '../models/app-models';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) {}

  getThemes(){
    return this.db.collection('themes').snapshotChanges();
  }

  createTheme(value){
    return this.db.collection('themes').add({
      name: value.name,
    });
  }

  getThemeByKey(themeKey){
    return this.db.collection('themes').doc(themeKey).snapshotChanges();
  }

  updateUser(themeKey, value){
    value.nameToSearch = value.name.toLowerCase();
    return this.db.collection('themes').doc(themeKey).set(value);
  }

  deleteUser(themeKey){
    return this.db.collection('themes').doc(themeKey).delete();
  }

  create(theme: Theme){
    return this.db.collection('themes').add(theme);
  }

  update(theme: Theme){
    //delete theme.id;
    this.db.doc('themes/' + theme.id).update(theme);
  }

  delete(policyId: string){
    this.db.doc('themes/' + policyId).delete();
  }


}
