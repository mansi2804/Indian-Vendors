import { Component, OnInit } from '@angular/core';
import { Register } from 'src/app/interfaces/register';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  opened = false;
  user: any;
  vendors?: Register[];
  admins?: Register[];
  userisvendor: any;
  userisadmin: any;
  displayNameOnNav: any;

  constructor(public dataService: DataService) {
    this.displayNameOnNav = localStorage
      .getItem('user')
      ?.split('@')[0]
      .replace('"', '');
    this.user = localStorage.getItem('user');
    this.dataService.getAllVendors().subscribe((res: any) => {
      this.vendors = res;
      console.log(`res`, res);
      this.vendors?.forEach((ele) => {
        if (this.user == '"' + ele.userid + '"') {
          this.userisvendor = ele.isvendor;
        }
      });
      console.log(`done`);
    });
    this.dataService.getAllAdmins().subscribe((res: any) => {
      this.admins = res;
      console.log(`res`, res);
      this.admins?.forEach((ele) => {
        if (this.user == '"' + ele.userid + '"') {
          this.userisadmin = ele.isadmin;
        }
      });
      console.log(`done`);
    });
  }
  toggleSidebar() {
    this.opened = !this.opened;
  }
  logoutUser() {
    this.dataService.logout();
  }
  ngOnInit(): void {}
}
