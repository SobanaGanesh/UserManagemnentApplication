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
}