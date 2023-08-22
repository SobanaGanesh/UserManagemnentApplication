import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  userForm!: FormGroup;
  displayedColumns: string[] = ['name', 'username', 'phone', 'website', 'actions'];
  editingUser: User | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      name: [''],
      username: [''],
      phone: [''],
      website: [''],
    });
   }

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      phone: ['', Validators.required],
      website: ['', Validators.required]
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  createUser(): void {
    if (this.userForm.valid) {
      const newUser: User = {
        id: 0, // This will be assigned by the API
        ...this.userForm.value
      };

      this.userService.createUser(newUser).subscribe(createdUser => {
        this.users.push(createdUser);
        this.userForm.reset();
      });
    }
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.userForm.setValue({
      name: user.name,
      username: user.username,
      phone: user.phone,
      website: user.website
    });
  }

  updateUser(): void {
    if (this.editingUser && this.userForm.valid) {
      const updatedUser: User = {
        ...this.editingUser,
        ...this.userForm.value
      };

      this.userService.updateUser(updatedUser).subscribe(() => {
        const index = this.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }

        this.editingUser = null;
        this.userForm.reset();
      });
    }
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(user => user.id !== id);
    });
  }
}