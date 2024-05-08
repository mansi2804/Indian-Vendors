import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Login } from '../interfaces/login';
import { Register } from '../interfaces/register';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  register = {} as Register;
  registerDataFb: any;
  login = {} as Login;
  isLoggedIn = false;

  user: any; //for signup and signup localstorage
  public vendorsCollection: AngularFirestoreCollection<Register>;
  public adminsCollection: AngularFirestoreCollection<Register>;
  public vendorUser: Observable<Register[]> | any;
  public adminsUser: Observable<Register[]> | any;
  public admin: any;
  vendor: any;
  constructor(
    private _auth: AngularFireAuth,
    private router: Router,
    private http: HttpClient,
    public afs: AngularFirestore
  ) {
    // this.vendorUser = this.afs.collection('vendors').valueChanges();
    //defining collection
    this.vendorsCollection = this.afs.collection('vendors');
    this.adminsCollection = this.afs.collection('admins');
    //fetching data as well as id from the firebase
    this.vendorUser = this.vendorsCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Register;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
    //fetching all the admins from firestore ('admins') to adminUser Observable array
    this.adminsUser = this.adminsCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const user = a.payload.doc.data() as Register;
          user.id = a.payload.doc.id;
          return user;
        });
      })
    );
    this.gettingAdmins(); //down
    this.gettingVendors(); //down
  } //constructor ends
  err = '';

  // saveUserCredentials(data: Register) {
  //   return this.http.post(this.usersInfoUrl, data);
  // }
  //for register normal user
  async registerUser(data: Register) {
    if (
      data.password == undefined ||
      data.password == null ||
      data.cpassword == undefined ||
      data.cpassword == null
    ) {
      alert('password field cant be null');
    }
    if (data.password != data.cpassword) {
      alert('please enter the correct password');
    }
    if (data.password == data.cpassword) {
      await this._auth
        .createUserWithEmailAndPassword(data.userid, data.password)
        .then((res) => {
          this.router.navigate(['/accounts/login']);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  }
  //for login
  async loginUser(data: Login) {
    await this._auth
      .signInWithEmailAndPassword(data.userid, data.password)
      .then((res) => {
        console.log('loggedin', data.userid, data.password);
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user?.email));
        this.user = localStorage.getItem('user');
        this.admin.forEach((ele: any) => {
          if (this.user == '"' + ele.userid + '"' && ele.isadmin) {
            //checking localstorage userid and firestore admins userid with isadmin flag=1
            this.router.navigate(['/dashboard']).then(() => {
              location.reload();
            });
          }
        });
        this.admin.forEach((ele: any) => {
          if (this.user != '"' + ele.userid + '"') {
            //checking localstorage  userid and admins firestore userid is not equal with isadmin flag=0
            this.router.navigate(['/']).then(() => {
              location.reload();
            });
          }
        });
        this.vendor.forEach((ele: any) => {
          if (this.user == '"' + ele.userid + '"' && ele.isvendor) {
            //checking localstorage userid and firestore vendors userid with isvendor flag=1
            this.router.navigate(['vendordashboard/add-products']).then(() => {
              location.reload();
            });
          }
        });
      })
      .catch((error) => {
        alert(error);
      });
  }
  //logout
  async logout() {
    await this._auth.signOut();
    this.router.navigate(['/accounts/login']).then((res) => {
      localStorage.removeItem('user');
      location.reload();
    });
  }
  //adding to signin firebase and firestore db only vendors
  async adminAddedVendors(data: Register) {
    await this._auth
      .createUserWithEmailAndPassword(data.userid, data.password)
      .then((res) => {});
  }
  //adding vendors to firestore
  addVendorToDb(data: Register) {
    console.log('addvendor', data);
    this.vendorsCollection.add(data);
  }

  //fetching all vendors
  getAllVendors() {
    return this.vendorUser;
  }
  // getting vendors in dataService constructor and storing it in the vendor var
  gettingVendors() {
    this.getAllVendors().subscribe((res: any) => {
      this.vendor = res;
      console.log('vendors', this.vendor);
      // this.vendor.forEach((element: any) => {
      //   console.log(`ven`, element.userid);
      // });
    });
  }

  //fetching all admins
  getAllAdmins() {
    return this.adminsUser;
  }
  // getting admins in dataService constructor and storing it in the admin var
  gettingAdmins() {
    this.getAllAdmins().subscribe((res: any) => {
      this.admin = res;
      console.log('admins', this.admin);
      // this.admin.fo  ach((element: any) => {
      //   console.log(`element.userid`, element.userid);
      // });
    });
  }
  //for removing vendor from admin dashboard
  
  removeVendorFromDb(vendor: Register) {
    let ven = this.afs.collection('vendors');
    ven
      .doc(vendor.id)
      .delete()
      .then(() => {
        this._auth
          .signInWithEmailAndPassword(vendor.userid, vendor.password)
          .then(() => {
            let user = this._auth.currentUser;
            user.then((res) => {
              res?.delete();
            });
          });
      });
  }
}
