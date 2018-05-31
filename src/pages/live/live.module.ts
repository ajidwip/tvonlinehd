import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LivePage } from './live';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    LivePage,
  ],
  imports: [
    IonicPageModule.forChild(LivePage),
    PipesModule
  ],
})
export class LivePageModule {}
