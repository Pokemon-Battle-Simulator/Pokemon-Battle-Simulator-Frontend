import { BattleDataService } from './../../services/battle-data.service';
import { AppComponent } from './../../app.component';
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
  public errorMessage = ''

  constructor(private userService: UserService, private router: Router, private appComponent: AppComponent,
    private battleDataService: BattleDataService) { }

  ngOnInit(): void {

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
      data => {
        console.log(data)
        this.battleDataService.changeUser(data);
        this.navigateToMenu();
      },
      error => console.error(error)
    )

  }

  public loginUser(event):void{

    event.preventDefault()

    this.userService.logInUser(this.user.username, this.user.password)
    .subscribe(
      data => {
        const token = data.headers.get('portal-token')

        sessionStorage.setItem('token', token)

        if(token){
          this.battleDataService.changeUser(data.body);
          this.navigateToMenu()
        }
      },
      error => this.errorMessage = 'User with given credentials does not exist. Please try again.'
    )

  }

  public navigateToMenu():void{
    this.router.navigateByUrl('/main-menu')
  }

}
