import { Component, OnInit } from '@angular/core';
import { AddProducts } from 'src/app/interfaces/addProducts';
import { AddProductsService } from 'src/app/services/add-products.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  products?: AddProducts[];
  user: any;
  re = /\"/gi;
  constructor(public productService: AddProductsService) {
    this.user = localStorage.getItem('user')?.replace(this.re, '');
  }
  deleteProduct(prod: AddProducts) {
    this.productService.deleteVendorProduct(prod);
  }
  ngOnInit(): void {
    this.productService.getProducts().subscribe((res: any) => {
      this.products = res;
      console.log(`res`, res);
    });
  }
}
