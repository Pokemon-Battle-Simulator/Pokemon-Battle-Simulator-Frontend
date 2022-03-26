import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { HttpClientModule } from '@angular/common/http';
import { PokemonSelectorComponent } from './components/pokemon-selector/pokemon-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    PokemonSelectorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
