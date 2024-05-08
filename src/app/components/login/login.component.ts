import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isActive = false;
  constructor(public dataService: DataService) {}
  active() {
    this.isActive = !this.isActive;
  }
  loginHandler(logincredentials: NgForm) {
    console.log(logincredentials.value);
    this.dataService.loginUser(logincredentials.value);
    logincredentials.resetForm();
  }
  temp(){}
  ngOnInit(): void {}
}
