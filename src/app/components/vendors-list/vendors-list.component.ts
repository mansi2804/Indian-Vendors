import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Register } from 'src/app/interfaces/register';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.css'],
})
export class VendorsListComponent implements OnInit {
  vendors?: Register[];
  constructor(public dataService: DataService) {}
  removeVendor(vendor: Register) {
    this.dataService.removeVendorFromDb(vendor);
  }
  ngOnInit(): void {
    this.dataService.getAllVendors().subscribe((res: any) => {
      this.vendors = res;
      console.log(`res`, res);
    });
  }
}
