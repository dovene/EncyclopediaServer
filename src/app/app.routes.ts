import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditUserResolver } from './edit-user/edit-user.resolver';
import { WelcomeComponent } from './welcome/welcome.component';
import {TopicComponent } from './topic/topic.component';
import {CountryComponent} from './country/country.component';
import {PersonalityComponent} from './personality/personality.component';
import {StoryComponent} from './story/story.component';

export const rootRouterConfig: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'welcome', component: WelcomeComponent },
 // { path: '', component: HomeComponent },
  { path: 'topic', component: TopicComponent },
  { path: 'country', component: CountryComponent },
  { path: 'personality', component: PersonalityComponent },
  { path: 'home', component: HomeComponent },
  { path: 'story', component: StoryComponent },
  { path: 'new-user', component: NewUserComponent },
  { path: 'details/:id', component: EditUserComponent, resolve:{data : EditUserResolver} }
];
