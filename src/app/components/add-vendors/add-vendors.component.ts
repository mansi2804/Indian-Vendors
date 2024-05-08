import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-add-vendors',
  templateUrl: './add-vendors.component.html',
  styleUrls: ['./add-vendors.component.css'],
})
export class AddVendorsComponent implements OnInit {
  constructor(public dataService: DataService) {}
  addVendors(formData: NgForm) {
    this.dataService
      .adminAddedVendors(formData.value)
      .then(() => this.dataService.addVendorToDb(formData.value))
      .then(() => {
        formData.resetForm();
      });
    //formData.resetForm();
  }
  ngOnInit(): void {}
}
