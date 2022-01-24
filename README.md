# game_SpaceDebris_tetris
Game Tetris clone in Space
- Electron - for building desktop apps with JS, HTML and CSS
- Capacitor - for building web native cross platform apps using JS, HTML, CSS. Alternativa je ApacheCordova. Capacitor podrzava Cordova plugine

**Install angular**
```
npm install -g @angular/cli

# da kreira osnovni node folder. 
ng new cross-platform-monorepo --createApplication=false
ng generate application tetris
ng generate library game-engine-lib
```

**add scripts**
```
"scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",

    "_comment-tetris" : "=======================START TETRIS========================",
    "start:tetris": "ng serve tetris -o",
    "build:tetris": "ng build tetris",
    "test:tetris": "ng test tetris",
    "lint:tetris": "ng lint tetris",
    "e2e:tetris": "ng e2e tetris",
    "build:game-engine-lib": "ng build game-engine-lib --watch",
    "test:game-engine-lib": "ng test game-engine-lib",
    "lint:game-engine-lib": "ng lint game-engine-lib",
    "e2e:game-engine-lib": "ng e2e game-engine-lib"
    }
```

**tsconfig.ts** - utice na import direktive
```
"paths": {
    "@game-engine-lib": [
    "dist/game-engine-lib/game-engine-lib",
    "dist/game-engine-lib"
    ]
}
```

**game-engine-lib.service.ts**
```
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameEngineLibService {

  get testing(): string {
    return "GameEngineLibService works!";
  }

  constructor() { }
}
```
`npm run build:game-engine-lib`

**app.module.ts**
```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GameEngineLibModule } from '@game-engine-lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    GameEngineLibModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

**app.component.ts**
```
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
```

**start project**
`npm run start:tetris`

# Building code
```
cd tetris/src/app
ng generate c components/board
```