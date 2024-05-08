import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { SidebarModule } from 'ng-sidebar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { FormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AddVendorsComponent } from './components/add-vendors/add-vendors.component';
import { VendorsListComponent } from './components/vendors-list/vendors-list.component';
import { AddProductsComponent } from './components/add-products/add-products.component';
import { AddProductsService } from './services/add-products.service';
import { SelectedProductComponent } from './components/selected-product/selected-product.component';
import { CartComponent } from './components/cart/cart.component';
import { VendorsdashboardComponent } from './components/vendorsdashboard/vendorsdashboard.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { SelectedOrderedProductComponent } from './components/selected-ordered-product/selected-ordered-product.component';
import { SlangcommentlistComponent } from './components/slangcommentlist/slangcommentlist.component';
import { GooglePayButtonModule } from '@google-pay/button-angular';
import { AboutusComponent } from './components/aboutus/aboutus.component';
const routes: Routes = [
  { path: 'accounts/register', component: RegisterComponent },
  { path: 'accounts/login', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'dashboard/add-vendors', component: AddVendorsComponent },
  { path: 'dashboard/vendors-list', component: VendorsListComponent },
  { path: 'dashboard/slang-comments', component: SlangcommentlistComponent },
  {
    path: 'vendordashboard/add-products',
    component: AddProductsComponent,
  },
  { path: 'vendordashboard/product-list', component: ProductsListComponent },
  { path: 'product', component: SelectedProductComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  {
    path: 'selected-ordered-product',
    component: SelectedOrderedProductComponent,
  },
];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    AdminDashboardComponent,
    AddVendorsComponent,
    VendorsListComponent,
    AddProductsComponent,
    SelectedProductComponent,
    CartComponent,
    VendorsdashboardComponent,
    ProductsListComponent,
    OrderHistoryComponent,
    SelectedOrderedProductComponent,
    SlangcommentlistComponent,
    AboutusComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    SidebarModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
    FormsModule,
    AngularFireStorageModule,
    GooglePayButtonModule,
  ],
  providers: [DataService, AddProductsService],

  bootstrap: [AppComponent],
})
export class AppModule {}
