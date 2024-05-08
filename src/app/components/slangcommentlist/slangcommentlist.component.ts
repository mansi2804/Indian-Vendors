import { Component, OnInit } from '@angular/core';
import { Comments } from 'src/app/interfaces/comments';
import { AddProductsService } from 'src/app/services/add-products.service';

@Component({
  selector: 'app-slangcommentlist',
  templateUrl: './slangcommentlist.component.html',
  styleUrls: ['./slangcommentlist.component.css'],
})
export class SlangcommentlistComponent implements OnInit {
  slangComments?: Comments[];
  constructor(public productService: AddProductsService) {
    this.productService.getSlangComments().subscribe((Res: any) => {
      this.slangComments = Res;
      console.log(`this.slangComments`, this.slangComments);
    });
  }
  uploadComment(badword: Comments) {
    this.productService.uploadSlangCommentToDb(badword);
  }
  deleteComment(badword: Comments) {
    this.productService.deleteSlangCommentToDb(badword);
  }

  ngOnInit(): void {}
}
