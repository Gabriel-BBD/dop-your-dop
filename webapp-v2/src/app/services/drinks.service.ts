import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DrinksService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  async postDrink(drink:string, quantity:string){
    const username = localStorage.getItem('username');

    if(!username){
      this.router.navigate(['/login']);
    }
  
    try {
      const time = new Date();
      const data = {
        username: localStorage.getItem('username'),
        drink: drink,
        quantity: quantity,
        time: time
       };

      // Send a POST request to the /user/register endpoint
      return this.http.post<any>('https://ptjm55hxb2.eu-west-1.awsapprunner.com/usersDrinks', data).toPromise();
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async getDrinks(){
    const username = localStorage.getItem('username');

    if(!username){
      this.router.navigate(['/login']);
    }
    return this.http.get<any>('https://ptjm55hxb2.eu-west-1.awsapprunner.com/drinks').toPromise();
  }

  async getUsersDrinks(){
    const username = localStorage.getItem('username');
    if(!username){
      this.router.navigate(['/login']);
    }
    return this.http.post<any>('https://ptjm55hxb2.eu-west-1.awsapprunner.com/usersDrinks', {username}).toPromise();
  }
}
