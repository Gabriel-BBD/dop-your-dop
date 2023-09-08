import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderConfigModel } from '../models/shared.models';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  headerConfig!: HeaderConfigModel;

  constructor(
    private router: Router,
    private authService:AuthService
  ){}

  ngOnInit(): void {
    this.headerConfig = {
      headerText: 'Register',
      buttonContent:'Login',
      action: () => {
        console.log('clicked')
        this.router.navigate(['/login'])
      }
    }
  }

  async register(data:any){
    this.authService.register(data).then((response) => {
      console.log(response)
      localStorage.setItem('username',response.username)
      this.router.navigate(['/home']);
    }).catch((error) => {
      console.log(error)
    })
  }
}
