import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AddProductsService } from "src/app/services/add-products.service";
import { AddProducts } from "../../interfaces/addProducts";
@Component({
  selector: "app-selected-ordered-product",
  templateUrl: "./selected-ordered-product.component.html",
  styleUrls: ["./selected-ordered-product.component.css"],
})
export class SelectedOrderedProductComponent implements OnInit {
  product = {} as AddProducts;
  user: any;
  re = /\"/gi;
  currentdate = new Date();
  monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  postComment(formData: NgForm) {
    if (
      formData.value.comment == null ||
      formData.value.comment == undefined ||
      formData.value.comment == ""
    ) {
      alert("comment section cannot be null");
    } else {
      formData.value.date = `Date:${this.currentdate.getDate()}/${
        this.monthNames[this.currentdate.getMonth()]
      }/${this.currentdate.getFullYear()} Time: ${this.currentdate.getHours()}:${this.currentdate.getMinutes()}`;
      formData.value.userid = this.user;
      formData.value.productid = this.product.productid;
      this.productService.postComment(formData.value);
      formData.resetForm();
      // alert('comment posted');
    }
  }
  constructor(public productService: AddProductsService) {
    this.product = JSON.parse(<string>localStorage.getItem("orderhistory"));
    this.user = localStorage.getItem("user")?.replace(this.re, "");
  }

  ngOnInit(): void {}
}
