import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service'
import { User } from '../../models/user'

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  public existingUser:boolean = true;
  public user = new User(0, '', '', '', '', '', '')

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.existingUser)

  }

  public toggleExistingUser():void{

    if(this.existingUser === true){
      this.existingUser = false;
    }else{
      this.existingUser = true;
    }
  }

  public getRegisterDisplay():string{
    return this.existingUser === true ? 'none' : 'block'
  }
  public getLoginDisplay():string{
    return this.existingUser === true ? 'block' : 'none'
  }

  public registerUser(event):void{

    event.preventDefault();

    this.userService.registerUser(this.user)
    .subscribe(
      data => console.log('Successful Registration'),
      error => console.error('Registration Failed')
    )


    this.router.navigateByUrl('/main-menu')
  }

  public setLoginPayload(event):void{

    event.preventDefault()

  }

  public navigateToManu():void{
    this.router.navigateByUrl('/main-menu')
  }
}
