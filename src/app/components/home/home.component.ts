import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddProductsService } from 'src/app/services/add-products.service';
import { AddProducts } from '../../interfaces/addProducts';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  score = 0;
  constructor(
    public productService: AddProductsService,
    public router: Router
  ) {
    this.getAllProducts();
   
  }
  products: any;
 
  getAllProducts() {
    this.productService.getProducts().subscribe((res: any) => {
      this.products = res;
      console.log('products', this.products);
    });
  }

  onSelect(prod: AddProducts) {
    // console.log('selevted prod', prod);
    this.productService.getSingleProductFromHome(prod);
  }
  added = false; //for button changing
  propsid = null;
  cart(prod: AddProducts) {
    this.products.forEach((element: any) => {
      if (prod.id == element.id) {
        this.added = true; //for single product button change in html
        this.propsid = prod.id; //for single product button change in html
        prod.productid = element.id;
        this.productService.addToCart(prod);
        setTimeout(() => {
          this.router.navigate(['/cart']);
        }, 500);
      }
    });
    console.log(prod.id);
  }
  ngOnInit(): void {}
}
