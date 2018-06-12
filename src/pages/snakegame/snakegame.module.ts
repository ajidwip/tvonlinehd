import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SnakegamePage } from './snakegame';
import { BestScoreManager } from './snakegame.storage.service';

@NgModule({
  declarations: [
    SnakegamePage,
  ],
  imports: [
    IonicPageModule.forChild(SnakegamePage),
  ],
  providers: [
    BestScoreManager
  ]
})
export class SnakegamePageModule {}
