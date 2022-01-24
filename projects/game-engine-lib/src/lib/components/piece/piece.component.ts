import { Component, OnInit } from '@angular/core';
import { IPiece } from '../../model/IPiece';
import {BLOCK_SIZE} from '../../constants'
import { IPosition } from '../../model/IPosition';
@Component({
  selector: 'lib-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class Piece implements OnInit, IPiece {
  x: number = 0;
  y: number = 0;
  color: string = 'black';
  shape: number[][] = [];

  constructor(private ctx: CanvasRenderingContext2D) {
    this.spawn();
  }



  ngOnInit(): void {
    
  
  }

  spawn() {
    this.color = 'blue';

    // UKLONI POSLEDNJI DA BI IMAO TRANSPOSED PROMENLJIVI
    this.shape = [[1, 0, 0], [1, 1, 1],[0,0,0]];

    // Position where the shape spawns.
    this.x = 3;
    this.y = 0;
  }

  rotate() {
    // Transpose matrix
    for (let y = 0; y < this.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [this.shape[x][y], this.shape[y][x]] = [this.shape[y][x], this.shape[x][y]];

        this.draw();
      }
    }// Reverse the order of the columns.
    this.shape.forEach(row => row.reverse());
  }


  getNextDownSoft = ():Piece => {
    return {...this, y: this.y + 1}
  }
  getNextDownHard = ():Piece => {
    return {...this, y: this.y + 2}
  }
  getNextLeft = ():Piece => {
    return {...this, x: this.x - 1}
  }
  getNextRight = ():Piece => {
    return {...this, x: this.x + 1}
  }

  moveDownSoft = () => {
    this.move({...this, y: this.y + 1})
  }
  moveDownHard = () => {
    this.move({...this, y: this.y + 2})
  }
  moveLeft = () => {
    this.move({...this, x: this.x - 1})
  }
  moveRight = () => {
    this.move({...this, x: this.x + 1})
  }

  private move(p: IPiece) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }

 

  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          // this.x & this.y = position on the board
          // x & y position are the positions of the shape
          this.ctx.fillRect(this.x * BLOCK_SIZE + x * BLOCK_SIZE, this.y * BLOCK_SIZE + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      });
    });
  }

}
