import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContentVideoComponent } from './content-video';

@NgModule({
  declarations: [
    ContentVideoComponent,
  ],
  imports: [
    IonicPageModule.forChild(ContentVideoComponent),
  ],
  exports: [
    ContentVideoComponent
  ]
})
export class ContentVideoComponentModule {}
