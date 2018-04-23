import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsdetailPage } from './newsdetail';

@NgModule({
  declarations: [
    NewsdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(NewsdetailPage),
  ],
})
export class NewsdetailPageModule {}
