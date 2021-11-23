import { on_board, nrange, index2pos, pos2index, get_color } from "./utils";
const is_win = (board: number[][]): number => {
    const dirs = [[0, 1], [1, 0], [1, 1]];
    let winner = 0;
    board.flat().forEach((val, index) => {
        const [x, y] = index2pos(index, board);
        const flag = dirs.some(d =>
            Math.abs(
                nrange(0, 5)
                    .map(i => new Array(d[0] * i + x, d[1] * i + y))
                    .filter(pos => on_board(pos, board))
                    .reduce((prev, cur) => prev + get_color(board[cur[0]][cur[1]]), 0)
            )
            == 5
        );
        if (flag) winner = val % 2 == 1 ? 1 : -1;
    });
    return winner;
};
export default is_win;

