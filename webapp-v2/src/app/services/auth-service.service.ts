import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  async register(data:{username: string, password: string, email: string}): Promise<any> {
    try {
      // Define the request body
      const requestBody = {
        username: data.username,
        password: data.password,
        email: data.email,
      };

      // Send a POST request to the /user/register endpoint
      return this.http.post<any>('https://ptjm55hxb2.eu-west-1.awsapprunner.com/user/register', requestBody).toPromise();
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<any> {
    try {
      // Define the request body
      const requestBody = {
        username: username,
        password: password,
      };

      // Send a POST request to the /user/login endpoint
      return this.http.post<any>('https://ptjm55hxb2.eu-west-1.awsapprunner.com/user/login', requestBody).toPromise();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }
}
