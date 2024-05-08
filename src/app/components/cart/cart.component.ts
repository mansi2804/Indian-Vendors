import { Component, OnInit } from "@angular/core";
import { AddProducts } from "src/app/interfaces/addProducts";
import { AddProductsService } from "src/app/services/add-products.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  
  paymentRequest: google.payments.api.PaymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: [
            "AMEX",
            "DISCOVER",
            "INTERAC",
            "JCB",
            "MASTERCARD",
            "VISA",
          ],
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example",
            gatewayMerchantId: "exampleGatewayMerchantId",
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: "12345678901234567890",
      merchantName: "Demo Merchant",
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Total",
      totalPrice:"10",
      currencyCode: "INR",
      countryCode: "IN",
    },
    callbackIntents: ["PAYMENT_AUTHORIZATION"],
  };
  cartProducts: any;
  re = /\"/gi;
  totalAmmount = 0;
  localuser = localStorage.getItem("user")?.replace(this.re, "");
  constructor(public productService: AddProductsService) {
    this.productService.getProductsFormCart().subscribe((res: any) => {
      this.cartProducts = res;
      console.log(`this.cartProducts`, this.cartProducts);
    });
  }
  removeFromCart(prod: AddProducts) {
    this.productService.removeElement(prod);
  }
  onLoadPaymentData = (event: Event) => {
    const eventDetail = event as CustomEvent<google.payments.api.PaymentData>;
    console.log("load payment data", eventDetail.detail);
  };
  onPaymentDataAuthorized: google.payments.api.PaymentAuthorizedHandler = (
    paymentData
  ) => {
    console.log("payment authorized", paymentData);
    return {
      transactionState: "SUCCESS",
    };
    alert("Payment Succedd");
  };

  placeOrder(cart: any) {
    this.cartProducts = [...cart];
    this.productService.orderHistory(this.cartProducts);
  }
  onError = (event: ErrorEvent) => {
    console.error("error", event.error);
  };
  ngOnInit(): void {}
}
