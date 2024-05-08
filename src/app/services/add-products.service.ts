import { Injectable } from "@angular/core";
import { AddProducts } from "../interfaces/addProducts";
import { Comments } from "../interfaces/comments";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFireList } from "@angular/fire/database";
import { Observable } from "rxjs";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import Sentiment from "sentiment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AddProductsService {
  products = {} as AddProducts;
  badWords = [] as any | String;
  productList!: AngularFireList<any>;
  allProducts: Observable<AddProducts[]> | any;
  productsFromCart: Observable<AddProducts[]> | any;
  allOrderHistory: Observable<AddProducts[]> | any;
  allComments: Observable<Comments[]> | any;
  allSlangComments: Observable<Comments[]> | any;
  ProductsArray: any;

  re = /\"/gi;
  public cartcollection: AngularFirestoreCollection<AddProducts>;
  public productCollection: AngularFirestoreCollection<AddProducts>;
  public orderHistoryCollection: AngularFirestoreCollection<AddProducts>;
  public commentCollection: AngularFirestoreCollection<Comments>;
  public badCommentCollection: AngularFirestoreCollection<Comments>;
  constructor(
    public afs: AngularFirestore,
    public router: Router,
    public storage: AngularFireStorage,
    public http: HttpClient
  ) {
    console.log(`heloo`);
    this.productCollection = this.afs.collection("products"); //products collection
    this.cartcollection = this.afs.collection("cart"); //cart collection
    this.orderHistoryCollection = this.afs.collection("orderhistory"); //order history collection
    this.commentCollection = this.afs.collection("comments"); //comments collection
    this.badCommentCollection = this.afs.collection("badcomments");
    //fetching all products
    this.allProducts = this.productCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((data) => {
          const products = data.payload.doc.data() as AddProducts;
          products.id = data.payload.doc.id;
          return products;
        });
      })
    );
    //fetching all cart products
    this.productsFromCart = this.cartcollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((data) => {
          const cart = data.payload.doc.data() as AddProducts;
          cart.id = data.payload.doc.id;
          return cart;
        });
      })
    );
    //fetching all product history
    this.allOrderHistory = this.orderHistoryCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((data) => {
          const prodhist = data.payload.doc.data() as AddProducts;
          prodhist.id = data.payload.doc.id;
          return prodhist;
        });
      })
    );
    //fetching all comments
    this.allComments = this.commentCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((data) => {
          const cmmnt = data.payload.doc.data() as Comments;
          cmmnt.id = data.payload.doc.id;
          return cmmnt;
        });
      })
    );
    this.allSlangComments = this.badCommentCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((data) => {
          const slangwrd = data.payload.doc.data() as Comments;
          slangwrd.id = data.payload.doc.id;
          return slangwrd;
        });
      })
    );
    fetch("assets/lang.json")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.badWords = data.words;
      });
  }
  selectedProduct = {} as AddProducts;
  getSingleProductFromHome(prod: AddProducts) {
    this.selectedProduct = prod;
    this.router.navigate(["/product"]);
    localStorage.setItem("product", JSON.stringify(this.selectedProduct));
    console.log("product ser", this.selectedProduct);
  }
  uploadProductToDb(data: AddProducts) {
    // data.vendorid = <string>localStorage.getItem('user')?.replace(this.re, '');
    console.log("productinfo", data);

    this.productCollection.add(data);
    // this.productList.push(data);
  }
  //returning all products from the firebase as observable
  getProducts() {
    return this.allProducts;
  }

  addToCart(prod: AddProducts | any) {
    prod.userid = localStorage.getItem("user")?.replace(this.re, "");

    this.cartcollection.add(prod);
  }
  getProductsFormCart() {
    return this.productsFromCart;
  }
  removeElement(prod: AddProducts) {
    if (confirm("would you like to remove this product from the cart..?")) {
      let currentprod = this.afs.collection("cart");
      currentprod.doc(prod.id).delete();
    }
  }
  //adding orderhistory and deleting cartcollection
  orderHistory(cart: any) {
    cart.forEach((element: any) => {
      this.orderHistoryCollection.add(element).then(() => {
        this.cartcollection.doc(element.id).delete();
      });
    });
  }
  //fetching all product history
  getOrderHistory() {
    return this.allOrderHistory;
  }
  //for vendors deleting product
  deleteVendorProduct(prod: AddProducts) {
    let vendorProd = this.afs.collection("products");
    vendorProd
      .doc(prod.id)
      .delete()
      .then(() => {
        this.storage.refFromURL(prod.productimage).delete();
      });
  }
  //navigate order history product
  particularOrderedProduct = {} as AddProducts;
  navigateHistoryProduct(order: AddProducts) {
    this.particularOrderedProduct = order;
    console.log(`this.particularOrderedProduct`, this.particularOrderedProduct);
    localStorage.setItem(
      "orderhistory",
      JSON.stringify(this.particularOrderedProduct)
    );
    this.router.navigate(["selected-ordered-product"]);
  }
  comments = {} as Comments;

  //post comments
  sentiment = new Sentiment();
  result: string | undefined;
  postComment(comment: Comments): any {
    this.result = JSON.stringify(comment.comment).toLowerCase();
    console.log(`sentiment.`, this.sentiment.analyze(this.result));
    if (this.sentiment.analyze(this.result).score > 0) {
      console.log(`positive`);
      comment.score = this.sentiment.analyze(this.result).score;
      this.commentCollection.add(comment);
      //checking negative comments (slang words)
    } else if (this.sentiment.analyze(this.result).score < 0) {
      for (let i of this.sentiment.analyze(this.result).negative) {
        for (let j of this.badWords) {
          if (i == j) {
            comment.score = this.sentiment.analyze(this.result).score;
            this.badCommentCollection.add(comment);
            console.log(`<0`, comment);
            break;
          }
        }
        break;
      }
      
      //checking negative comments (slang words)
    } else {
      for (let i of this.badWords) {
        for (let j of this.sentiment.analyze(this.result).tokens) {
          if (i == j) {
            comment.score = this.sentiment.analyze(this.result).score;
            this.badCommentCollection.add(comment);
            console.log(`==0`, i.toLowerCase());
            break;
          }
        }
      }
    }
  }
  uploadSlangCommentToDb(badword: Comments) {
    //from adminDashboard upload as good comment
    if (confirm("you would like to upload this comment ?")) {
      let bad = this.afs.collection("badcomments");
      bad
        .doc(badword.id)
        .delete()
        .then(() => {
          this.commentCollection.add(badword);
        });
    }
  }
  deleteSlangCommentToDb(badword: Comments) {
    let slang = this.afs.collection("badcomments");
    slang.doc(badword.id).delete();
  }
  getSlangComments() {
    return this.allSlangComments;
  }
  getComments() {
    return this.allComments;
  }
}
