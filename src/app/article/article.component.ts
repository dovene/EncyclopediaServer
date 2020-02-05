import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ArticleService } from '../services/article.service';
import { Article, ModalDataModel, Country, Personality, Topic } from '../models/app-models';
import { MatDialog } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { CountryService } from '../services/country.service';
import { PersonalityService } from '../services/personality.service';
import { TopicService } from '../services/topic.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  articles: Article[];
  mustDisplayForm: boolean = false;
  isFormInAddMode: boolean;
  currentArticle: any = {};
  savedArticle: any = {};
  position: number;
  imageFile: File;
  modalData: ModalDataModel = new ModalDataModel();
  dateStart : Date ;
  dateEnd : Date;
  countries: Country[];
  selectedCountry: Country;
  selectedPersonality: Personality;
  personalities: Personality[];
  selectedTopic: Topic;
  secondaryTopic: Topic;
  secondaryCountry: Country;
  secondaryPersonality: Personality;
  secondaryImageFile: File;
  topics: Topic[];
  imageList: FileList;


  constructor(public articleService: ArticleService,
    public location: Location,
    public firestorage: AngularFireStorage,
    public dialog: MatDialog,
    public countryService: CountryService,
    public personalityService: PersonalityService,
    public topicService: TopicService) { }


  ngOnInit() {
    this.getData();
  }

  getData(): void {
    console.log("getData");
    this.articleService.getArticles().subscribe(data => {
      this.articles = data.map(e => {
       let article =  {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } ;
       // console.log(data);
        console.log(article)
        return {
          id: article.id,
          mainImage: article.mainImage,
          title: article.title,
          content: article.content,
          dateStart: article.dateStart ? article.dateStart.toDate() : null,
          dateEnd: article.dateEnd ? article.dateEnd.toDate() : null,
          mainCountry: article.mainCountry,
          mainPersonality: article.mainPersonality,
          sourceName: article.sourceName,
          sourceUrl: article.sourceUrl,
          mainTopic: article.mainTopic,
          secondaryTopic: article.secondaryTopic,
          secondaryCountry: article.secondaryCountry,
          secondaryPersonality: article.secondaryPersonality,
        } 
      })
    });
    // get countries 
    this.countryService.getCountries().subscribe(data => {
      this.countries = data.map(e => {
        console.log(data);
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Country;
      })
    });
    // get peronalities
    this.personalityService.getPersonalities().subscribe(data => {
      this.personalities = data.map(e => {
       let parsedPersonality =  {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } ;
        return {
          id: parsedPersonality.id,
          photoUrl: parsedPersonality.photoUrl,
          fullName: parsedPersonality.fullName,
          dateOfBirth: parsedPersonality.dateOfBirth ? parsedPersonality.dateOfBirth.toDate() : null, 
          dateOfDeath: parsedPersonality.dateOfDeath ? parsedPersonality.dateOfDeath.toDate() : null
          
        } 
      })
    });
    // get topics
    this.topicService.getTopics().subscribe(data => {
      this.topics = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Topic;
      })
    });
  }

  saveRecord(article: Article) {
    console.log(article)
    article.dateStart = this.dateStart;
    article.dateEnd = this.dateEnd;
    article.mainCountry = this.selectedCountry;
    article.mainPersonality = this.selectedPersonality;
    article.mainTopic = this.selectedTopic;
    article.secondaryTopic = this.secondaryTopic;
    article.secondaryCountry = this.secondaryCountry;
    article.secondaryPersonality = this.secondaryPersonality;
    
    if (this.isFormInAddMode) {
      // add a new project
      this.articleService.create(article, this.imageFile, this.secondaryImageFile)
        .then(() => {
          this.currentArticle = null;
        })
    } else {
      //update the existing project
      this.articleService.update(article, this.imageList)
        .then(() => {
          this.currentArticle = null;
          // this.goBack()
        }
        )
    }
    this.mustDisplayForm = false;
  }

  goBack(): void {
    this.location.back();
  }


  displayEditForm(article: Article) {
    if (!article) {
      this.mustDisplayForm = false;
      return;
    }
    this.mustDisplayForm = true;
    this.isFormInAddMode = false;
    this.currentArticle = article;
    this.savedArticle = <Article>JSON.parse(JSON.stringify(article));;
    this.position = this.articles.indexOf(article);
    console.log(this.savedArticle);
  }

  displayAddForm() {
    console.log("displayAddProjectForm")
    //reset form if in edit mode
    if (this.articles.length) {
      this.currentArticle = {}
      console.log("edit")
    }
    this.mustDisplayForm = true;
    this.isFormInAddMode = true;
    console.log("new")
  }

  handleFileInput(files: FileList) {
    this.imageFile = files.item(0);
    this.secondaryImageFile = files.item(1);
    this.imageList = files
  }

  deleteRecord(article: Article): void {
    this.articleService
      .delete(article)
      .then(() => {
        this.articles = this.articles.filter(h => h !== article);
        if (this.currentArticle === article) { this.currentArticle = null; }
      });
    console.log(this.articles);
  }

  cancel() {
    if (!this.isFormInAddMode) {
      this.articles.splice(this.position, 1, this.savedArticle);
      console.log(this.articles);
    }
    this.mustDisplayForm = false;
    this.currentArticle = {};
  }

  openDialog(article: Article) {

    console.log(article);
    if (article != null && article.mainImage != null && article.mainImage != "") {

      console.log("downloadURL");
      this.firestorage.ref(article.mainImage).getDownloadURL().subscribe(res => {

        console.log(JSON.stringify(res));

        this.modalData.title = article.title;
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

  onStartDateChanged(date): void {
    this.dateStart = date;
  }

  onEndDateChanged(date): void {
    this.dateEnd = date;
  }

  onMainCountrySelected(country){
    this.selectedCountry = <Country> JSON.parse(country);
   console.log(this.selectedCountry);
  }

  onMainPersonalitySelected(personality){
    this.selectedPersonality = <Personality> JSON.parse(personality);
   console.log(this.selectedPersonality);
  }

  onMainTopicSelected(topic){
    this.selectedTopic = <Topic> JSON.parse(topic);
   console.log(this.selectedTopic);
  }

  onSecondaryTopicSelected(topic){
    this.secondaryTopic = <Topic> JSON.parse(topic);
   console.log(this.secondaryTopic);
  }
  onSecondaryCountrySelected(country){
    this.secondaryCountry = <Country> JSON.parse(country);
   console.log(this.secondaryCountry);
  }
  onSecondaryPersonalitySelected(personality){
    this.secondaryPersonality = <Personality> JSON.parse(personality);
   console.log(this.secondaryPersonality);
  }

  toString(anything): string{
    return JSON.stringify(anything);
  }

  shortenString(anything: string): string{
    return anything.substr(0,150) ;
  }

}
