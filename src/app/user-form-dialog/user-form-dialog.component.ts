import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.css'],
})
export class UserFormDialogComponent {
  userForm: FormGroup;
  filteredUsers: User[] = [];
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.userForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      username: ['', Validators.required],
      phone: ['', Validators.required],
      website: ['', Validators.required],
    });

    if (data.user) {
      this.userForm.patchValue(data.user);
    }
  }

  save(): void {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      if (this.data.user) {
        // Update user
        this.userService.updateUser(user).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        // Create user
        this.userService.createUser(user).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      if (this.userForm.valid) {
        const newUser: User = {
          id: 0, // This will be assigned by the API
          ...this.userForm.value
        };
        const updatedUser: User = {
          ...this.userForm.value,
          
        };
        if (this.data.user) {
          this.userService.updateUser(updatedUser).subscribe(() => {
            const index = this.filteredUsers.findIndex(user => user.id === updatedUser.id);
            if (index !== -1) {
              //this.users[index] = updatedUser;
              const result = {
                param1: updatedUser, // Replace with your actual values
                param2: index
              };
          
              this.dialogRef.close(result);
    
            }
    
            this.userForm.reset();
          });
        }else{
          this.userService.createUser(newUser).subscribe(createdUser => {
            this.dialogRef.close(createdUser);
          });
        }
       
      }
  
      // Close the dialog
      this.dialogRef.close(this.userForm);
    }
  }
}