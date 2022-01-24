import { Component } from '@angular/core';
import {GameEngineLibService} from "@game-engine-lib";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tetris';

  constructor(engine: GameEngineLibService) {
    console.log(engine.testing);
  }
}
