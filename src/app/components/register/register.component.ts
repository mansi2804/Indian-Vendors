import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(public dataService: DataService) {}
  isActive = false;
  active() {
    this.isActive = !this.isActive;
  }
  registerHandler(formData: NgForm) {
    this.dataService.registerUser(formData.value);
    formData.resetForm();
  }
  ngOnInit(): void {}
}
