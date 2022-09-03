import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { TodayComponent } from './today/today.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ArchiveComponent } from './archive/archive.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { UpcomingComponent } from './upcoming/upcoming.component';

//setting the route path for the pages, so that without reloading user can go from one page to another page
const routes: Routes = [
  {path: '', component: HomepageComponent, children: [
    {path: 'today', component: TodayComponent},
    {path: 'upcoming', component: UpcomingComponent},                     //chidren of Hoepage Componenet
    {path: 'archive', component: ArchiveComponent},
    {path: 'search-result', component: SearchResultComponent}
  ]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
