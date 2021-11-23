import is_win from "./win";
import {next_move} from "./ai";
import { init_array2 } from "./utils";
let board = init_array2(15, 15, 0);

let i = 0;
while (is_win(board) == 0) {
    let [x, y] = next_move(board);
    i += 1;
    board[x][y] = i;
    console.log(x, y);
}
console.log(is_win(board));
console.log(board)