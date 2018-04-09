import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContentNewsComponent } from './content-news';

@NgModule({
  declarations: [
    ContentNewsComponent,
  ],
  imports: [
    IonicPageModule.forChild(ContentNewsComponent),
  ],
  exports: [
    ContentNewsComponent
  ]
})
export class ContentNewsComponentModule {}
