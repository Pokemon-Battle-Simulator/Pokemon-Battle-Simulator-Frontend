import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { HttpClientModule } from '@angular/common/http';
import { PokemonSelectorComponent } from './components/pokemon-selector/pokemon-selector.component';
import { ErrorComponent } from './components/error/error.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { FormsModule } from '@angular/forms';
import { SessionComponent } from './components/session/session.component'


//Each rout is represented by a Javascript object.
const appRoutes: Routes = [
  {path:'', component: AuthenticationComponent},

  {path:'main-menu', component: MainMenuComponent},
  //This will automatically append localhost:4200/ in front.
  {path:'pokemon-selector', component: PokemonSelectorComponent},

  {path:'session', component: SessionComponent},

  {path:'*', component: ErrorComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    PokemonSelectorComponent,
    ErrorComponent,
    MainMenuComponent,
    SessionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes) //This registers our routes to the angular application.
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
