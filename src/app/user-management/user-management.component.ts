import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  userForm!: FormGroup;
  displayedColumns: string[] = ['name', 'username', 'phone', 'website', 'actions'];
  dataSource = new MatTableDataSource(this.users);
  filteredUsers: User[] = [];
  filterValue = '';
  editingUser: User | null = null;

  constructor(private fb: FormBuilder, private userService: UserService,private dialog: MatDialog) {
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
      this.filteredUsers = users; // Initialize filteredUsers with all users

    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '400px',
      data: { title: 'Edit Form' } // You can pass additional data to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.filteredUsers.push(result.value);
      console.log(result)
console.log(result)
    });
  }
  createUser(): void {
    if (this.userForm.valid) {
      const newUser: User = {
        id: 0, // This will be assigned by the API
        ...this.userForm.value
      };

      this.userService.createUser(newUser).subscribe(createdUser => {
        //this.users.push(createdUser);
        this.filteredUsers.push(createdUser);
        this.userForm.reset();
      });
    }
  }

  editUser(user: User): void {
    this.editingUser = user;
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '400px',
      data: { title: 'Edit Form',user:user } // You can pass additional data to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.filteredUsers.push(result.value);
      this.filteredUsers[result.value.id] = result.value;

    });
    
  }

  updateUser(): void {
    if (this.editingUser && this.userForm.valid) {
      const updatedUser: User = {
        ...this.editingUser,
        ...this.userForm.value,
        
      };

      this.userService.updateUser(updatedUser).subscribe(() => {
        const index = this.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          //this.users[index] = updatedUser;
          this.filteredUsers[index] = updatedUser;

        }

        this.editingUser = null;
        this.userForm.reset();
      });
    }
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.filteredUsers = this.filteredUsers.filter(user => user.id !== id);
    });
  }

  applyFilter(): void { 
    this.filteredUsers = this.users.filter((user) =>
    user.name.toLowerCase().includes(this.filterValue.toLowerCase())
  );
  }
}