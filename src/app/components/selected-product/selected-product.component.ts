import { Component, OnInit } from '@angular/core';
import { AddProductsService } from 'src/app/services/add-products.service';
import { AddProducts } from 'src/app/interfaces/addProducts';
import { Comments } from 'src/app/interfaces/comments';
@Component({
  selector: 'app-selected-product',
  templateUrl: './selected-product.component.html',
  styleUrls: ['./selected-product.component.css'],
})
export class SelectedProductComponent implements OnInit {
  product = {} as AddProducts;
  comments: any;
  products: any;
  constructor(public productService: AddProductsService) {
    this.product = JSON.parse(<string>localStorage.getItem('product'));
    this.productService.getComments().subscribe((res: any) => {
      this.comments = res;
    });
    this.productService.getProducts().subscribe((res: any) => {
      this.products = res;
    });
  }
  calculateScore(comment: Comments): any {
    let score = 0;
    if (comment.score < 0 || comment.score == 0) {
      score = 1;
      return score;
    } else if (comment.score > 0 && comment.score <= 3) {
      score = 2;
      return score;
    } else if (comment.score > 3 && comment.score <= 5) {
      score = 3;
      return score;
    } else if (comment.score > 5 && comment.score <= 7) {
      score = 4;
      return score;
    } else if (comment.score > 7) {
      score = 5;
      return score;
    }
  }

  ngOnInit(): void {
    console.log(this.product.productname);
    console.log(`product.id`, this.product.id);
  }
}
