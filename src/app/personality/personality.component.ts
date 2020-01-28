import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PersonalityService } from '../services/personality.service';
import { Personality, ModalDataModel, ParsedPersonality } from '../models/app-models';
import { MatDialog } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { firestore } from 'firebase';

@Component({
  selector: 'app-personality',
  templateUrl: './personality.component.html',
  styleUrls: ['./personality.component.css']
})

export class PersonalityComponent implements OnInit {
  personalities: Personality[];
  mustDisplayForm: boolean = false;
  isFormInAddMode: boolean;
  currentPersonality: any = {};
  savedPersonality: any = {};
  position: number;
  imageFile: File;
  modalData: ModalDataModel = new ModalDataModel();
  dateOfBirth : Date ;
  dateOfDeath : Date;


  constructor(public personalityService: PersonalityService,
    public location: Location,
    public firestorage: AngularFireStorage,
    public dialog: MatDialog) { }


  ngOnInit() {
    this.getData();
  }

  getData(): void {
    console.log("getData");
    this.personalityService.getPersonalities().subscribe(data => {
      this.personalities = data.map(e => {
       let parsedPersonality =  {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } ;
       // console.log(data);
        console.log(parsedPersonality)
        return {
          id: parsedPersonality.id,
          photoUrl: parsedPersonality.photoUrl,
          fullName: parsedPersonality.fullName,
          dateOfBirth: parsedPersonality.dateOfBirth ? parsedPersonality.dateOfBirth.toDate() : null, // Date(),//Date.parse(parsedPersonality.dateOfBirth),
          
          dateOfDeath: parsedPersonality.dateOfDeath ? parsedPersonality.dateOfDeath.toDate() : null//Date.parse(parsedPersonality.dateOfBirth),
          
        } 
      })
    });
  }

  saveRecord(personality: Personality) {
    console.log(personality)
    personality.dateOfBirth = this.dateOfBirth;
    personality.dateOfDeath = this.dateOfDeath;
    if (this.isFormInAddMode) {
      // add a new project
      this.personalityService.create(personality, this.imageFile)
        .then(() => {
          this.currentPersonality = null;
        })
    } else {
      //update the existing project
      this.personalityService.update(personality, this.imageFile)
        .then(() => {
          this.currentPersonality = null;
          // this.goBack()
        }
        )
    }
    this.mustDisplayForm = false;
  }

  goBack(): void {
    this.location.back();
  }


  displayEditForm(personality: Personality) {
    if (!personality) {
      this.mustDisplayForm = false;
      return;
    }
    this.mustDisplayForm = true;
    this.isFormInAddMode = false;
    this.currentPersonality = personality;
    this.savedPersonality = <Personality>JSON.parse(JSON.stringify(personality));;
    this.position = this.personalities.indexOf(personality);
    console.log(this.savedPersonality);
  }

  displayAddForm() {
    console.log("displayAddProjectForm")
    //reset form if in edit mode
    if (this.personalities.length) {
      this.currentPersonality = {}
      console.log("edit")
    }
    this.mustDisplayForm = true;
    this.isFormInAddMode = true;
    console.log("new")
  }

  handleFileInput(files: FileList) {
    this.imageFile = files.item(0);
  }

  deleteRecord(personality: Personality): void {
    this.personalityService
      .delete(personality)
      .then(() => {
        this.personalities = this.personalities.filter(h => h !== personality);
        if (this.currentPersonality === personality) { this.currentPersonality = null; }
      });
    console.log(this.personalities);
  }

  cancel() {
    if (!this.isFormInAddMode) {
      this.personalities.splice(this.position, 1, this.savedPersonality);
      console.log(this.personalities);
    }
    this.mustDisplayForm = false;
    this.currentPersonality = {};
  }

  openDialog(personality: Personality) {

    console.log(personality);
    if (personality != null && personality.photoUrl != null && personality.photoUrl != "") {

      console.log("downloadURL");
      this.firestorage.ref(personality.photoUrl).getDownloadURL().subscribe(res => {

        console.log(JSON.stringify(res));

        this.modalData.title = personality.fullName;
        this.modalData.description = "";
        this.modalData.imageUrl = res;
        this.modalData.isOkVisible = true;
        this.modalData.isCancelVisible = false;

        const dialogRef = this.dialog.open(ModalDialogComponent, {
          height: '400px',
          width: '400px',
          data: JSON.stringify(this.modalData),
        });

        dialogRef.afterClosed().subscribe(result => {

        });
      });

    } else {


      console.log("image not available");
      this.modalData.title = "Error";
      this.modalData.description = "No image";
      this.modalData.imageUrl = "";
      this.modalData.isOkVisible = true;
      this.modalData.isCancelVisible = false;

      this.dialog.open(ModalDialogComponent, {

        data: JSON.stringify(this.modalData),
      });
    }
  }

  dateConverter(date: Date):string {
    return date? date.toLocaleString().substr(0,10): "";
  }

  onBirthDateChanged(date): void {
    this.dateOfBirth = date;
  }

  onDeathDateChanged(date): void {
    this.dateOfDeath = date;
  }

}
