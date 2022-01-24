import { NgModule } from '@angular/core';
import { Board } from './components/board/board.component';
import { GameEngineLibComponent } from './game-engine-lib.component';
import { Piece } from './components/piece/piece.component';


@NgModule({
  declarations: [
    GameEngineLibComponent,
    Board,
    Piece
  ],
  imports: [
  ],
  exports: [
    GameEngineLibComponent,
    Board
  ]
})
export class GameEngineLibModule { }
