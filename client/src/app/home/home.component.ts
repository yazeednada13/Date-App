import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  registerMode = false;
  http = inject(HttpClient);
  users : any;
  registerToggle(){
    this.registerMode = !this.registerMode;
  }
  ngOnInit(): void {
    this.getUsers();
  }
  cancelRegisterMode(event: boolean){
    this.registerMode = event;
  }
  getUsers(){
    this.http.get('https://localhost:5001/api/user').subscribe({
      next : response  => this.users = response, // Arrow Function (Response from API)
      error: error => console.log(error),
      complete:() => console.log("Request has completed")
    })
  }
}
