import { Component, OnInit } from '@angular/core';
import { AddProducts } from 'src/app/interfaces/addProducts';
import { AddProductsService } from 'src/app/services/add-products.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  orderhistory: any;
  user: any;
  re = /\"/gi;
  constructor(public productService: AddProductsService) {
    this.productService.getOrderHistory().subscribe((res: any) => {
      this.orderhistory = res;
      console.log(`res`, res);
    });
  }
  navigateFullOrderHistory(order: AddProducts) {
    this.productService.navigateHistoryProduct(order);
  }
  ngOnInit(): void {
    this.user = localStorage.getItem('user')?.replace(this.re, '');
  }
}
