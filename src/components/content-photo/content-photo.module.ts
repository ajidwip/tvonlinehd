import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContentPhotoComponent } from './content-photo';

@NgModule({
  declarations: [
    ContentPhotoComponent,
  ],
  imports: [
    IonicPageModule.forChild(ContentPhotoComponent),
  ],
  exports: [
    ContentPhotoComponent
  ]
})
export class ContentPhotoComponentModule {}
