import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CountryService } from '../services/country.service';
import { Country, ModalDataModel } from '../models/app-models';
import { MatDialog } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component'

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  countries: Country[];
  mustDisplayForm: boolean = false;
  isFormInAddMode: boolean;
  currentCountry: any = {};
  savedCountry: any = {};
  position: number;
  imageFile: File;
  modalData: ModalDataModel = new ModalDataModel();


  constructor(public countryService: CountryService,
    public location: Location,
    public firestorage: AngularFireStorage,
    public dialog: MatDialog) { }


  ngOnInit() {
    this.getCountries();
  }

  getCountries(): void {
    this.countryService.getCountries().subscribe(data => {
      this.countries = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Country;
      })
    });
  }

  saveCountry(country: Country) {
    console.log(country)
    if (this.isFormInAddMode) {
      // add a new project
      this.countryService.createCountry(country, this.imageFile)
        .then(() => {
          this.currentCountry = null;
        })
    } else {
      //update the existing project
      this.countryService.updateCountry(country, this.imageFile)
        .then(() => {
          this.currentCountry = null;
          // this.goBack()
        }
        )
    }
    this.mustDisplayForm = false;
  }

  goBack(): void {
    this.location.back();
  }


  displayEditForm(country: Country) {
    if (!country) {
      this.mustDisplayForm = false;
      return;
    }
    this.mustDisplayForm = true;
    this.isFormInAddMode = false;
    this.currentCountry = country;
    this.savedCountry = <Country>JSON.parse(JSON.stringify(country));;
    this.position = this.countries.indexOf(country);
    console.log(this.savedCountry);
  }

  displayAddForm() {
    console.log("displayAddProjectForm")
    //reset form if in edit mode
    if (this.countries.length) {
      this.currentCountry = {}
      console.log("edit")
    }
    this.mustDisplayForm = true;
    this.isFormInAddMode = true;
    console.log("new")
  }

  handleFileInput(files: FileList) {
    this.imageFile = files.item(0);
  }

  deleteCountry(topic: Country): void {
    this.countryService
      .deleteCountry(topic)
      .then(() => {
        this.countries = this.countries.filter(h => h !== topic);
        if (this.currentCountry === topic) { this.currentCountry = null; }
      });
    console.log(this.countries);
  }

  cancel() {
    if (!this.isFormInAddMode) {
      this.countries.splice(this.position, 1, this.savedCountry);
      console.log(this.countries);
    }
    this.mustDisplayForm = false;
    this.currentCountry = {};
  }

  openDialog(country: Country) {
    if (country != null && country.imageUrl != null && country.imageUrl != "") {

      console.log("downloadURL");
      this.firestorage.ref(country.imageUrl).getDownloadURL().subscribe(res => {

        console.log(JSON.stringify(res));

        this.modalData.title = country.name;
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


}
