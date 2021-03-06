import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import 'rxjs/add/operator/toPromise';
import { Article } from '../models/app-models';
import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';

@Injectable({
    providedIn: 'root'
})

export class ArticleService {

    constructor(public firestore: AngularFirestore, public storage: AngularFireStorage) { }
    getArticles(): Observable<any> {
        let collectionRef = this.firestore.collection('articles', ref => ref.orderBy('title', 'asc'));
        collectionRef.snapshotChanges().subscribe(res => {
            console.log(res)
        })
        return collectionRef.snapshotChanges();
    }

    create(article: Article, imageFile: File, secondaryImageFile: File) {
        console.log('creation ' + article);
        let data = {
            title: article.title,
            content: article.content,
            dateStart: article.dateStart ? firestore.Timestamp.fromDate(article.dateStart) : null,
            dateEnd: article.dateEnd ? firestore.Timestamp.fromDate(article.dateEnd) : null,
            mainImage: "",
            secondaryImage: "",
            mainCountry: article.mainCountry,
            mainPersonality: article.mainPersonality ? article.mainPersonality: null,
            mainTopic: article.mainTopic,
            sourceName: article.sourceName ? article.sourceName: "",
            sourceUrl: article.sourceUrl ? article.sourceUrl : "",
            secondaryTopic: article.secondaryTopic ? article.secondaryTopic: null,
            secondaryCountry: article.secondaryCountry ? article.secondaryCountry : null,
            secondaryPersonality: article.secondaryPersonality ? article.secondaryPersonality : null,
        }
        if (imageFile != null) {
            const randomId = Math.random().toString(36).substring(2);
            const fileRef = this.storage.ref(randomId);
            fileRef.put(imageFile);
            article.mainImage = randomId;

            const randomIdSecondary = Math.random().toString(36).substring(2);
            const fileRefSecondary = this.storage.ref(randomIdSecondary);
            fileRefSecondary.put(secondaryImageFile);
            article.secondaryImage = randomIdSecondary;

            data.mainImage = randomId;
            data.secondaryImage = randomIdSecondary;
        }
        return this.firestore.collection('articles').add(data);
    }


    update(article: Article, images: FileList): Promise<any> {
        console.log('update ' + article);
        let data = {
            title: article.title,
            content: article.content,
            dateStart: article.dateStart ? firestore.Timestamp.fromDate(article.dateStart) : null,
            dateEnd: article.dateEnd ? firestore.Timestamp.fromDate(article.dateEnd) : null,
            mainImage: ""
        }
        if (images.item(0)  != null) {
            const randomId = Math.random().toString(36).substring(2);
            const fileRef = this.storage.ref(randomId);
            fileRef.put(images.item(0));
            data.mainImage = randomId;
        }
        return this.firestore.doc('articles/' + article.id).update(data);
    }

    delete(article: Article): Promise<any> {
        return this.firestore.doc('articles/' + article.id).delete()
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
