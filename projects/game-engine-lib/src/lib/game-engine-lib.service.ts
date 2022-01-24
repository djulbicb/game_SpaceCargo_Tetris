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
