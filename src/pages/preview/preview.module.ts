import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreviewPage } from './preview';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PreviewPage,
  ],
  imports: [
    IonicPageModule.forChild(PreviewPage),
    PipesModule
  ],
})
export class PreviewPageModule {}
