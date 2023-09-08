import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {
  myForm!: FormGroup; // Define the form group
  @Input() isRegister!:boolean;
  @Output() userConfirmed = new EventEmitter<any>();
  confirmPasswordError: string = '';
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // Initialize the form group and define form controls with validation
    if(this.isRegister){
      this.myForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],

      });
    }else{
      this.myForm = this.fb.group({
        name: ['', Validators.required],
        password: ['', [Validators.required]]
      });
    }
  }

  // Define the onSubmit method to handle form submission
  onSubmit() {
    if (this.myForm.valid) {
      const data = {
        password:this.myForm.get('password')?.value,
        username: this.myForm.get('name')?.value,
        email: this.myForm.get('email')?.value
      }
      if (this.isRegister) {
        // Check if confirmPassword control exists and compare it to the password control
        if (this.myForm.get('confirmPassword')) {
          const password = this.myForm.get('password')?.value;
          const confirmPassword = this.myForm.get('confirmPassword')?.value;
  
          if (password !== confirmPassword) {
            this.confirmPasswordError = 'Passwords do not match';
            return; // Prevent form submission if passwords don't match
          }
        }
      }
  
      // Reset confirmPasswordError if validation passes
      this.confirmPasswordError = '';
  
      // Form is valid, continue with form submission
      console.log('Form submitted:', this.myForm.value);
      this.userConfirmed.emit(data);
    }

    //  for now we will do this then replace
  }
}
