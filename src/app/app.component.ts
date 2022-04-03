import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-end';

  firstName: string = ''
  lastName: string = ''
  username: string = ''
  email: string = ''
  favoritePokemon: string = ''

  updateUserData(firstName:string, lastName:string, username:string, email:string, favoritePokemon:string){
    this.firstName = firstName
    this.lastName = lastName
    this.username = username
    this.email = email
    this.favoritePokemon = favoritePokemon
  }

  signout(){
    //reloading the window clears the session storage and logs out the user.
    window.location.reload()
  }

}
