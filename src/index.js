import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// 导入isWin 和 ai模块
import { next_move } from './strategy/ai'
import win from './strategy/win'

import white from './aseets/images/chess_white.png'
import black from './aseets/images/chess_black.png'

let humanPlayer = 1;
let aiPlayer = 2;
let aiPlayer2 = 1;
function Square (props) {
  let chessValue = props.value%2 == 0 ? "X":"O"; 
    return (
      <button className="square" onClick={props.onClick}>
        {/* {props.value == 0 ? null:chessValue} */}
        {props.value == 0? null :<img src = {chessValue== "O"? white:black} alt="chess"></img>}
      </button>
    );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
      ],
      xIsNext: true,
      aiPlay:false,
      maxij:null,
      
    };
  }
  handleClick([i,j]) {
    //人
    const squares = this.state.squares.slice();
    if (win(squares) == 1 || win(squares) == -1) {
      return;
    }
    
    squares[i][j] = humanPlayer;
    humanPlayer+=2;
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });

    //ai行动
    const squaresAi = this.state.squares.slice();
    const [x,y] = next_move(squaresAi)
    squaresAi[x][y] = aiPlayer;
    aiPlayer+=2;
  }

  renderSquare([i,j]) {
    return (
      <Square
        value={this.state.squares[i][j]}
        onClick={() => this.handleClick([i,j])}
        maxij = {this.state.maxij}
      />
    );
  }
  handleAiClick(){
      const squares = this.state.squares.slice();
      const [i,j] =  next_move(squares)
      if (win(squares) == 1 || win(squares) == -1) {
        return;
      }
      squares[i][j] = aiPlayer2;
      aiPlayer2+=2;
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
      });
  
      //ai行动
      const squaresAi = this.state.squares.slice();
      const [x,y] = next_move(squaresAi)
      squaresAi[x][y] = aiPlayer;
      aiPlayer+=2;
  }

  chooseAiplay = ()=>{
    this.setState({
      aiPlay:!this.state.aiPlay,
      squares: [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
      ],
    })
    setInterval(()=> this.handleAiClick(), 1000)
  }

  /**
   * @param {number[][]} array
   * @param {number[]} element
   * @return {boolean}
   **/
  arrayHasElement = function(array, element) {  // 判断二维数组array中是否存在一维数组element
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
          if(array[i][j] == element){
            return true
          }
       }
    }
    return false;
  }
  /**
   * @param {number[][]} array
   * @return {[x,y]}
   **/
  arrayMaxElement = function(array) {  // 判断二维数组array中是否存在一维数组element
    let max = array[0][0]
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
          if(array[i][j] > max){
            max = array[i][j]
            var [x,y] = [i,j]
          }
       }
    }
    return[x,y]
  }
  
  
  render() {
    const winner = win(this.state.squares);
    let status
    if (winner == -1) {
      status = "黑棋胜了"
       this.state.maxij = this.arrayMaxElement(this.state.squares)
    } else if(winner == 1){
      status = "白棋胜了"
      this.state.maxij = this.arrayMaxElement(this.state.squares)
    }
    let isDraw = this.arrayHasElement(this.state.squares,0)
    if(!isDraw){
      status = "平局"
    }
    const [x,y] = this.arrayMaxElement(this.state.squares)
    //判断board中没有0的时候，两个ai判断平局。
    return (
      <div className={"board"}>
        <button onClick = {this.chooseAiplay}>{this.state.aiPlay?"玩家对战人机":"人机互相对战"}</button>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare([0,0])}
          {this.renderSquare([0,1])}
          {this.renderSquare([0,2])}
          {this.renderSquare([0,3])}
          {this.renderSquare([0,4])}
          {this.renderSquare([0,5])}
          {this.renderSquare([0,6])}
          {this.renderSquare([0,7])}
        </div>
        <div className="board-row">
          {this.renderSquare([1,0])}
          {this.renderSquare([1,1])}
          {this.renderSquare([1,2])}
          {this.renderSquare([1,3])}
          {this.renderSquare([1,4])}
          {this.renderSquare([1,5])}
          {this.renderSquare([1,6])}
          {this.renderSquare([1,7])}
        </div>
        <div className="board-row">
          {this.renderSquare([2,0])}
          {this.renderSquare([2,1])}
          {this.renderSquare([2,2])}
          {this.renderSquare([2,3])}
          {this.renderSquare([2,4])}
          {this.renderSquare([2,5])}
          {this.renderSquare([2,6])}
          {this.renderSquare([2,7])}
        </div>
        <div className="board-row">
          {this.renderSquare([3,0])}
          {this.renderSquare([3,1])}
          {this.renderSquare([3,2])}
          {this.renderSquare([3,3])}
          {this.renderSquare([3,4])}
          {this.renderSquare([3,5])}
          {this.renderSquare([3,6])}
          {this.renderSquare([3,7])}
        </div>
        <div className="board-row">
          {this.renderSquare([4,0])}
          {this.renderSquare([4,1])}
          {this.renderSquare([4,2])}
          {this.renderSquare([4,3])}
          {this.renderSquare([4,4])}
          {this.renderSquare([4,5])}
          {this.renderSquare([4,6])}
          {this.renderSquare([4,7])}
        </div>
        <div className="board-row">
          {this.renderSquare([5,0])}
          {this.renderSquare([5,1])}
          {this.renderSquare([5,2])}
          {this.renderSquare([5,3])}
          {this.renderSquare([5,4])}
          {this.renderSquare([5,5])}
          {this.renderSquare([5,6])}
          {this.renderSquare([5,7])}
        </div>
        <div className="board-row">
          {this.renderSquare([6,0])}
          {this.renderSquare([6,1])}
          {this.renderSquare([6,2])}
          {this.renderSquare([6,3])}
          {this.renderSquare([6,4])}
          {this.renderSquare([6,5])}
          {this.renderSquare([6,6])}
          {this.renderSquare([6,7])}
        </div>
        <div className="board-row">
          {this.renderSquare([7,0])}
          {this.renderSquare([7,1])}
          {this.renderSquare([7,2])}
          {this.renderSquare([7,3])}
          {this.renderSquare([7,4])}
          {this.renderSquare([7,5])}
          {this.renderSquare([7,6])}
          {this.renderSquare([7,7])}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

