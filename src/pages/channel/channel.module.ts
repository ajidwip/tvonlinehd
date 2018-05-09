import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChannelPage } from './channel';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ChannelPage,
  ],
  imports: [
    IonicPageModule.forChild(ChannelPage),
    PipesModule
  ],
})
export class ChannelPageModule {}
