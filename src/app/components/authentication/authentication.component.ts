import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  existingUser:boolean = true;
  firstName:string = ''
  lastName:string = ''
  email:string = ''
  userName:string = ''
  password:string = ''
  favoritePokemon:string = ''

  constructor() { }

  ngOnInit(): void {
  }

  toggleExistingUser():void{

    if(this.existingUser == true){
      this.existingUser = false;
    }else{
      this.existingUser = true;
    }
  }

  getRegisterDisplay():string{
    return this.existingUser === true ? 'none' : 'block'
  }
  getLoginDisplay():string{
    return this.existingUser === true ? 'block' : 'none'
  }
  setFirstName(event):void{
    this.firstName = event.target.value
  }
  setLastName(event):void{
    this.lastName = event.target.value
  }
  setEmail(event):void{
    this.email = event.target.value
  }
  setUserName(event):void{
    this.userName = event.target.value
  }
  setPassword(event):void{
    this.password = event.target.value
  }
  setFavoritePokemon(event):void{
    this.favoritePokemon = event.target.value
  }
  setRegistrationPayload(event):void{

    event.preventDefault();

    const body = {
      firstName:this.firstName,
      lastName:this.lastName,
      email:this.email,
      username:this.userName,
      password:this.password,
      favoritePokemon:this.favoritePokemon
    }

    console.log(body)
  }

  setLoginPayload(event):void{

    event.preventDefault()

    const body = {
      username:this.userName,
      password:this.password
    }

    console.log(body)
  }
}
