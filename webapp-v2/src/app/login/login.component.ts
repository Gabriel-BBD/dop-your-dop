import { Component, OnInit } from '@angular/core';
import { HeaderConfigModel } from '../models/shared.models';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  headerConfig!: HeaderConfigModel;

  constructor(
    private router: Router,
    private authService:AuthService
  ){}

  ngOnInit(): void {
    this.headerConfig = {
      headerText: 'Login',
      buttonContent:'Register',
      action: () => {
        console.log('clicked')
        this.router.navigate(['/register'])
      }
    }
  }  

  login(data:any){
    this.authService.login(data.username, data.password).then((res) => {
      console.log(res)
      localStorage.setItem('username', res.username)
      this.router.navigate(['/home']);
    }).catch((error) => {
      console.log(error)
    })
  }
}
