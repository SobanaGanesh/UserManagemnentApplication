import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;

  
  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  createUser(): void {
    if (this.userForm.valid) {
      const user: User = {
        id: 0,
        name: this.userForm.value.name,
        username:this.userForm.value.username,
        email: this.userForm.value.email,
        phone:this.userForm.value.phone,
        website:this.userForm.value.website

      };

      this.userService.createUser(user).subscribe(newUser => {
        console.log('User created:', newUser);
        this.userForm.reset();
      });
  

      
    }
  }
}