import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TopicService } from '../services/topic.service';
import { Topic, ModalDataModel } from '../models/app-models';
import { from, Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component'
import { empty, of } from "rxjs";

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})

export class TopicComponent implements OnInit {
  topics: Topic[];
  topicForm: boolean = false;
  isNewForm: boolean;
  currentTopic: any = {};
  savedTopic: any = {};
  position: number;
  imageFile: File;
  modalData: ModalDataModel = new ModalDataModel();

  constructor(private topicService: TopicService,
    private location: Location,
    public firestorage: AngularFireStorage,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getProjects();
  }

  getProjects(): void {
    this.topicService.getTopics().subscribe(data => {
      this.topics = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Topic;
      })
    });
  }

  saveTopic(topic: Topic) {
    console.log(topic)
    if (this.isNewForm) {
      // add a new project
      this.topicService.createTopicWithImage(topic, this.imageFile)
        .then(() => {
          this.currentTopic = null;
        })
    } else {
      //update the existing project
      this.topicService.updateTopic(topic, this.imageFile)
        .then(() => {
          this.currentTopic = null;
          // this.goBack()
        }
        )
    }
    this.topicForm = false;
  }

  goBack(): void {
    this.location.back();
  }


  displayEditForm(topic: Topic) {
    if (!topic) {
      this.topicForm = false;
      return;
    }
    this.topicForm = true;
    this.isNewForm = false;
    this.currentTopic = topic;
    this.savedTopic = <Topic>JSON.parse(JSON.stringify(topic));;
    this.position = this.topics.indexOf(topic);
    console.log(this.savedTopic);
  }

  displayAddForm() {
    console.log("displayAddProjectForm")
    //reset form if in edit mode
    if (this.topics.length) {
      this.currentTopic = {}
      console.log("edit")
    }
    this.topicForm = true;
    this.isNewForm = true;
    console.log("new")
  }

  handleFileInput(files: FileList) {
    this.imageFile = files.item(0);
  }

  deleteTopic(topic: Topic): void {
    this.topicService
      .deleteTopic(topic)
      .then(() => {
        this.topics = this.topics.filter(h => h !== topic);
        if (this.currentTopic === topic) { this.currentTopic = null; }
      });
    console.log(this.topics);
  }

  cancel() {
    if (!this.isNewForm) {
      this.topics.splice(this.position, 1, this.savedTopic);
      console.log(this.topics);
    }
    this.topicForm = false;
    this.currentTopic = {};
  }

  downloadURL(topic: Topic) {
    console.log(topic);
    /*
     if(topic!=null && topic.imageUrl!=null && topic.imageUrl!="" ){
       return this.firestorage.ref(topic.imageUrl).getDownloadURL();
     } else {
       return empty();
     }
     */

  }

  openDialog(topic: Topic) {
    if (topic != null && topic.imageUrl != null && topic.imageUrl != "") {

      console.log("downloadURL");
      this.firestorage.ref(topic.imageUrl).getDownloadURL().subscribe(res => {

        console.log(JSON.stringify(res));

        this.modalData.title = topic.name;
        this.modalData.description = "";
        this.modalData.imageUrl = res;
        this.modalData.isOkVisible = true;
        this.modalData.isOkVisible = false;

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

      this.modalData.isOkVisible = false;

      this.dialog.open(ModalDialogComponent, {

        data: JSON.stringify(this.modalData),
      });
    }
  }
}

