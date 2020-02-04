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

    create(article: Article, imageFile: File) {
        console.log('creation ' + article);
        let data = {
            title: article.title,
            content: article.content,
            dateStart: article.dateStart ? firestore.Timestamp.fromDate(article.dateStart) : null,
            dateEnd: article.dateEnd ? firestore.Timestamp.fromDate(article.dateEnd) : null,
            mainImage: "",
            mainCountry: article.mainCountry,
            mainPersonality: article.mainPersonality,
            mainTopic: article.mainTopic,
            sourceName: article.sourceName,
            sourceUrl: article.sourceUrl,
        }
        if (imageFile != null) {
            const randomId = Math.random().toString(36).substring(2);
            const fileRef = this.storage.ref(randomId);
            fileRef.put(imageFile);
            article.mainImage = randomId;
            data.mainImage = randomId;
        }
        return this.firestore.collection('articles').add(data);
    }


    update(article: Article, imageFile: File): Promise<any> {
        console.log('update ' + article);
        let data = {
            title: article.title,
            content: article.content,
            dateStart: article.dateStart ? firestore.Timestamp.fromDate(article.dateStart) : null,
            dateEnd: article.dateEnd ? firestore.Timestamp.fromDate(article.dateEnd) : null,
            mainImage: ""
        }
        if (imageFile != null) {
            const randomId = Math.random().toString(36).substring(2);
            const fileRef = this.storage.ref(randomId);
            fileRef.put(imageFile);
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
