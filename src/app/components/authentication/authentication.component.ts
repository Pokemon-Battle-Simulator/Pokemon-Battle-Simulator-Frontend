import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { format } from 'path';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) { }

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

    //Send http request. The Angular http client will automatically
    //convert our object into JSON format. subscribe gives us access
    //to the response object. A request will not be sent unless you
    //subscribe.
    this.http.post('url-to-java-backend', body)
    .subscribe(responseData => {
      console.log(responseData)
    })

    this.router.navigateByUrl('/main-menu')
  }

  setLoginPayload(event):void{

    event.preventDefault()

    const body = {
      username:this.userName,
      password:this.password
    }

    console.log(body)
  }

  navigateToManu():void{
    this.router.navigateByUrl('/main-menu')
  }
}
