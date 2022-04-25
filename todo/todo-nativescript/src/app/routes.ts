import { Routes } from '@angular/router';
import { HomeComponent } from '@src/app/home/home.component';
import { DetailsComponent } from '@src/app/details/details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'details/:id', component: DetailsComponent }
];