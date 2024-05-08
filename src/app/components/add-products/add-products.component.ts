import { Component, OnInit } from '@angular/core';
import { Register } from 'src/app/interfaces/register';
import { AddProductsService } from 'src/app/services/add-products.service';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'],
})
export class AddProductsComponent implements OnInit {
  constructor(
    public productService: AddProductsService,
    public forContact: DataService,
    public storage: AngularFireStorage
  ) {
    this.forContact.getAllVendors().subscribe((res: any) => {
      console.log(`res`, res);
      res.forEach((element: any) => {
        console.log('contact', element.contactno);
        if (this.getLocalVendor == element.userid) {
          localStorage.setItem('contactno', <string>element.contactno);
        }
      });
    });
  }
  vendors: Register[] = [];
  re = /\"/gi;
  getLocalVendor = localStorage.getItem('user')?.replace(this.re, '');
  contactno = localStorage.getItem('contactno');
  filePath: any;
  selectedImg: any;
  imageSrc: string | undefined;
  userid: any;
  onFileSelected(event: any) {
    this.selectedImg = event.target.files[0];
    console.log(this.selectedImg);
    const imageReader = new FileReader();
    imageReader.readAsDataURL(this.selectedImg);
    imageReader.onload = () => {
      this.imageSrc = imageReader.result as string;
    };
  }
  fireBaseImageUrl: string | undefined;
  uploadProduct(formData: NgForm) {
    this.filePath = `products/${this.selectedImg.name
      .split('.')
      .slice(0, -1)}_${this.getLocalVendor}_${new Date().getTime()}`;
    const fileref = this.storage.ref(this.filePath);
    this.storage
      .upload(this.filePath, this.selectedImg)
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileref.getDownloadURL().subscribe((url) => {
            // console.log('imageurl', url); firebase uploaded img url coming from firestorage
            formData.value.productimage = url;
            formData.value.vendorid = this.getLocalVendor;
            formData.value.contactno = this.contactno;
            this.productService.uploadProductToDb(formData.value);
            // console.log(formData.value);
            formData.resetForm();
            this.selectedImg = null;
            this.imageSrc = '';
            // console.log('prodimg', formData.value.productimage);
          });
        })
      )
      .subscribe();
  }
  ngOnInit(): void {
    // this.dataService.getAllVendors().subscribe((res: any) => {
    //   this.vendors = res;
    //   console.log(`res`, res);
    // });
    console.log(localStorage.getItem('user'));

    this.userid = localStorage.getItem('user');
  }
}
