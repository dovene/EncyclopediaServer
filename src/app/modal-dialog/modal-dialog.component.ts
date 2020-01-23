import { Component, OnInit, Inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Topic, ModalDataModel} from '../models/app-models'
import { from } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit {

  avatars: Array<any> = new Array<any>();
  topic: any = {};
  imageUrl: string ="";
  modalDataModel : ModalDataModel;
 
  constructor(
    public dialogRef: MatDialogRef<ModalDialogComponent>,
    public firebaseService: FirebaseService,
    @Inject(MAT_DIALOG_DATA) public data: string,
    public firestorage: AngularFireStorage,
  ) { }

  ngOnInit() {
   console.log("Init");
   this.modalDataModel = <ModalDataModel>JSON.parse(this.data);
  }

  downloadURL(){
    console.log("downloadURL");
    this.firestorage.ref(this.topic.imageUrl).getDownloadURL().subscribe(res=>{

      console.log(JSON.stringify(res));
      this.imageUrl = res;
    })
   // return this.firestorage.ref(this.topic.imageUrl).getDownloadURL();
   }


  onCloseConfirm() {
    this.dialogRef.close('Confirm');
  }
  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

}
