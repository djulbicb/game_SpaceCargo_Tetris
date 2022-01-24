import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { COLS, BLOCK_SIZE, ROWS, KEY } from '../../constants';
import { IPiece } from '../../model/IPiece';
import { IPosition } from '../../model/IPosition';
import { Piece } from '../piece/piece.component';
@Component({
  selector: 'game-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class Board implements OnInit {

  @ViewChild('board', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  
  runGame: boolean = true;
  height: number = 0;
  width: number = 0;
  points: number = 0;
  lines: number = 0;
  level: number = 0;
  ctx:CanvasRenderingContext2D | null = null;

  piece:Piece | null = null;

  blocks:number[][] = []

  constructor(canvas: ElementRef<HTMLCanvasElement>) { 
    this.canvas = canvas;
    this.width = COLS * BLOCK_SIZE;
    this.height =  ROWS * BLOCK_SIZE;
  }
  
  moves:any = {
    [KEY.LEFT]:  (board:Board, p: Piece) => { const next = p.getNextLeft();
                                              if (board.insideBoard(next)) 
                                                {p.moveLeft()}
                                              },
    [KEY.RIGHT]: (board:Board, p: Piece) => { const next = p.getNextRight(); 
                                              if (board.insideBoard(next)) 
                                                {p.moveRight()}
                                            },
    [KEY.DOWN]:  (board:Board, p: Piece) => { const next = p.getNextDownHard(); 
                                              if (board.insideBoard(next))  {
                                                  p.moveDownHard()}
                                              },
    [KEY.UP]:  (board:Board, p: Piece) => { const next = p.getNextDownHard(); 
      if (board.insideBoard(next))  {
          p.rotate()}
      }
  };

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    // Calculate size of canvas from constants.
    this.ctx!.canvas.width = this.width;
    this.ctx!.canvas.height = this.height;

    this.ctx!.fillRect(30, 30, 10, 10);

    this.blocks = this.getEmptyBoard();
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    event.preventDefault();
    console.log(event.keyCode)
    if (this.moves[event.keyCode]) {
      this.moves[event.keyCode](this, this.piece);
      // Clear the old position before drawing
      this.clearBoard();
      this.removeLine();
      this.piece?.draw();
      this.drawBoardBlocks();
      // Draw the new position.

    }
  }

  time:any = {
    start: 0,
    elapsed : 0,
    level: 1000 
  }
  requestId:any = 0;

  createRandomBlock():Piece {
    return new Piece(this.ctx!)
  }

  animate(now = 0) {
    // Update elapsed time.
    this.time.elapsed = now - this.time.start;
    // If elapsed time has passed time for current level
    if (this.time.elapsed > this.time.level) {
      console.log("tick")
      // Reset start time
      this.time.start = now;
      // this.drop();

      const next:Piece | undefined = this.piece?.getNextDownSoft();
      if (this.insideBoard(next)) {
        console.log("moving down");
        this.piece?.moveDownSoft();
      } else {
        this.movePieceToBoardBlocks(this.piece);
        this.piece = this.createRandomBlock();

        console.log(this.blocks);
      }
      this.clearBoard();
      this.removeLine();
      this.piece?.draw();
      this.drawBoardBlocks();
    }
    requestAnimationFrame(this.animate.bind(this));
  }

  drawBoardBlocks() {
    
    for (let x = 0; x < this.blocks.length; x++) {
      const row:number[] = this.blocks[x];
      for (let y=0; y < row.length; y++) {
        const col = row[y];

        const block:number = this.blocks[x][y];
        if (block !== 0) {
          // REVERSED order of x y
          this.ctx?.fillRect(y*BLOCK_SIZE, x*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
        
      }
    }

    
  }

  movePieceToBoardBlocks(piece:Piece | null) {
    if (!piece) {
      return;
    }

    const blocks = this.getBlockIndexes(piece);

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];

            // REVERSED order of x y
      this.blocks[b.y][b.x] = 1;
    }
    return;
  }

  getBlockIndexes = (p:IPiece):IPosition[] => {
    const blocks:IPosition[] = [];
    p.shape.map((col:number[], yIdx:number) => {
      col.map((row:number, xIdx:number) => {
        const block = p.shape[yIdx][xIdx];
        if (block !== 0) {
          blocks.push({x: p.x + xIdx, y: p.y + yIdx});
        }
      })
    })

    console.log(">>>", blocks);
    return blocks;
  }

  insideBoard(p:Piece | undefined):boolean {
    const blocks = p ? this.getBlockIndexes(p) : [];

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      
      if (!(b.x >= 0) || !(b.x < COLS) || (b.y >= ROWS)) {
        return false;
      }   
      
      // REVERSED order of x y
      if (this.blocks[b.y][b.x] !== 0) {
        return false;
      }
    }
    
    return true;
  }

  getEmptyBoard(): number[][] {
    // returns 20(ROWS) arrays with 10(COLS) elements
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  ngOnInit(): void {
  }

  clearBoard() {
    this.ctx!.clearRect(0, 0, this.width, this.height);
  }

  removeLine() {
    console.log(this.blocks)
    for (let y=0; y<this.blocks.length; y++) {
      const row = this.blocks[y];

      let deleteRow = true;
      for (let x=0; x < this.blocks[y].length; x++) {
        if (deleteRow && row[x] !== 1) {
          deleteRow = false
        }
      }
      if (deleteRow) {
        console.log("DELETING ROW", y)
        for (let m=y; m>0; m--) {
          console.log("mmmm")
          this.blocks[m] = this.blocks[m-1];
        }

        this.blocks[0] = new Array(0).fill(0);
        
      }

    }
  }

  play() {
    this.piece = new Piece(this.ctx!);
    this.piece.draw();
    this.animate();
  }
}
