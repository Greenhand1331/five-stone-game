import { pipe } from "ts-pipe-compose";
import { network } from "./network";
import { init_array2, init_array3, init_array4, get_height, get_width, current_player, get_color, type_idx_for_color, max, get_color_board, get_board_now, on_board, pos2index, index2pos, get_hw, reshape2, get_chw, nrange } from "./utils";

const get_state = (board: number[][]): number[][][] => {
    const player = current_player(board);
    let state = init_array3(get_height(board), get_width(board), 3, 0);
    board.forEach((row, nrow) => {
        row.forEach((ele, ncol) => {
            // console.log(ele, get_color(ele),player,get_color(ele)==player);
            if (get_color(ele) == player) state[nrow][ncol][0] = 1;
            else if (get_color(ele) == -player) state[nrow][ncol][1] = 1;
            else state[nrow][ncol][2] = 1;
        });
    });
    // console.log(state);

    return state;
};



const get_action = (board: number[][]): number[][] => {
    let action: number[][] = [];
    board.forEach((row, nrow) => {
        row.forEach((ele, ncol) => {
            if (ele != 0) action.push([nrow, ncol, ele]);
        });
    });
    action.sort((a, b) => a[2] - b[2]);
    return action;
};

const stones6_from_board = (action: number[], color: number, board: number[][]): number[][] => {
    const dir_list = [[1, 0], [0, 1], [1, 1], [1, -1]];
    const ox = action[0], oy = action[1];
    let stones6_list: number[][] = [];
    dir_list.forEach((val, direction) => {
        const dx = val[0], dy = val[1];
        const rg = new Array<number>(5 + 1).fill(0).map((_, i) => 5 - i);
        rg.forEach(i => {
            const x = ox - dx * i, y = oy - dy * i;
            if (on_board([x, y], board) && on_board([x + dx * 5, y + dy * 5], board)) {
                const rg2 = new Array<number>(6).fill(0).map((_, i) => i);
                let stones6: number[] = [];
                rg2.forEach(j => {
                    stones6.push(board[x + dx * j][y + dy * j]);
                });
                stones6[i - 6] = color;
                stones6.push(direction);
                stones6_list.push(stones6);
            }
        });
    });
    return stones6_list;
};

const get_pattern = (stones6: number[], color: number): number => {
    const color_count = stones6.filter(val => val == color).length;
    const r_color = -color;
    const reverse_color_count = stones6.filter(val => val == r_color).length;
    if (color_count < 3) return 0;
    else if (color_count > 5) return 5;
    else if (color_count == 5) return stones6[0] != color || stones6[-1] != color ? 4 : 0;
    else if (color_count == 3) return stones6[0] == 0 && stones6[-1] == 0 && reverse_color_count == 0 ? 1 : 0;
    else if (color_count == 4) {
        if (stones6[0] == 0 && stones6[-1] == 0) return 3;
        else {
            if (reverse_color_count > 1) return 0;
            else if (reverse_color_count == 1)
                return stones6[0] == r_color || stones6[-1] == r_color ? 2 : 0;
            else return stones6[0] == 0 || stones6[-1] == 0 ? 2 : 0;
        }
    }
    return 0;
};

const get_types_for_pos = (pos: number[], board: number[][]): number[][] => {
    const color_list = [1, -1];
    let types: number[][] = init_array2(2, 4, 0);
    color_list.forEach((color) => {
        stones6_from_board(pos, color, board).forEach(val => {
            const dir = val[-1], stones6 = val.slice(0, -1), idc = type_idx_for_color(color);
            types[idc][dir] = max(types[idc][dir], get_pattern(stones6, color));
        });
    });
    return types;
};

const get_blank_types_for_move = (board: number[][]): number[][][][] => {
    let blank_board = init_array4(get_height(board), get_width(board), 2, 4, 0);
    const action_list = get_action(board);
    action_list.forEach((action, num) => {
        const board_now = get_color_board(get_board_now(board, num + 1));
        const directions: number[][] = [[1, 0], [0, 1], [1, 1], [1, -1]];
        const ox = action[0], oy = action[1];
        directions.forEach((dir, idx) => {
            const dx = dir[0], dy = dir[1];
            nrange(-5, 6).forEach(i => {
                const pos = [ox - dx * i, oy - dy * i];
                if (on_board(pos, board_now) && board_now[pos[0]][pos[1]] == 0) {
                    blank_board[pos[0]][pos[1]] = get_types_for_pos(pos, board_now);
                }
            });
        });
    });
    return blank_board;
};
const get_blank_types = (board: number[][]): number[][][] => {
    const line_list: number[] = [0, 1, 2, 3];
    const num_line = line_list.length, num_color = 2, maximum = 5;
    let planes = init_array3(get_height(board), get_width(board), num_line * num_color * maximum, 0);
    const player = current_player(board);
    const blank_types = get_blank_types_for_move(board);
    let player_list: number[] = [player, - player];
    player_list.forEach((color, idx) => {
        const color_idx = type_idx_for_color(color);
        board.forEach((row, x) => {
            row.forEach((_, y) => {
                line_list.forEach(line => {
                    const type = blank_types[x][y][color_idx][line];
                    if (type > 0) {
                        planes[x][y][(idx * num_line + line) * maximum + type - 1] = 1;
                    }
                });
            });
        });
    });
    return planes;
};
const merge = (...items: number[][][][]): number[][][] => {
    // const dim = items.reduce((a, b) => a + b[0][0].length, 0)
    let res: number[][][] = init_array3(items[0].length, items[0][0].length, 0, 0);
    res.forEach((row, i) => { row.forEach((col, j) => { items.forEach((item, id) => { res[i][j] = res[i][j].concat(item[i][j]); }); }); });
    return res;
};
const transpose = (mat: number[][][]): number[][][] => {
    const [h, w, c] = get_chw(mat);
    const res = init_array3(c, h, w, 0);
    mat.forEach((row, nrow) => {
        row.forEach((col, ncol) => {
            col.forEach((ele, nchannel) =>
                res[nchannel][nrow][ncol] = ele
            );
        });
    });
    return res;
};
export const hw2wh = (mat: number[][]): number[][] => {
    const [h, w] = get_hw(mat);
    const res = init_array2(w, h, 0);
    mat.forEach((row, nrow) => {
        row.forEach((ele, ncol) => {
            res[ncol][nrow] = ele;
        });
    });
    return res;
};
export const get_features = (board: number[][]): number[][][] => {
    const h: number = get_height(board), w: number = get_width(board);
    const state = get_state(board);
    const ones = init_array3(h, w, 1, 1);
    const black_types = get_blank_types(board);
    const black_ban = init_array3(h, w, 2, 0);
    const zeros = init_array3(h, w, 1, 0);
    const feature = merge(state, ones, black_types, black_ban, zeros);
    return transpose(feature);
};

const get_num_move = (board: number[][]) => board.flat().reduce((a, b) => a + (b == 0 ? 0 : 1), 0);

const get_avail = (board: number[][]): number[] => {
    const w = get_width(board);
    const h = get_height(board);
    let avail: number[] = [];
    const num_move = get_num_move(board);
    if (num_move == 0) {
        avail = [pos2index([Math.floor(h / 2), Math.floor(w / 2)], board)];
    }
    else if (num_move >= 1 && num_move < 4) {
        for (let i = Math.floor(h / 2) - 2; i <= Math.floor(h / 2) + 2; ++i) {
            for (let j = Math.floor(w / 2) - 2; j <= Math.floor(w / 2) + 2; ++j) {
                if (board[i][j] == 0) avail.push(pos2index([i, j], board));
            }
        }
    }
    else {
        for (let i = 0; i < h; ++i) {
            for (let j = 0; j < w; ++j) {
                if (board[i][j] == 0) avail.push(pos2index([i, j], board));
            }
        }
    }
    return avail;
};


const get_move_prob = (board: number[][], avail: number[]): number[][] => {
    const [h, w] = get_hw(board);
    const flat_prob = (x: number[][]): number[] => x.flat().map((val, index) => {
        return avail.includes(index) ? val : 0;
    });
    const output = pipe(board, get_features, network, reshape2(h, w), flat_prob, reshape2(h, w));
    // console.log("board len:", board.length);
    // console.log("feature:len", get_features(board).length);
    // console.log("feature:len", get_features(board)[0].length);
    // console.log("feature:", get_features(board));
    return output;
};

export const next_move = (board: number[][]): [number, number] => {
    board = hw2wh(board);
    const avail = get_avail(board);
    const move_probs = get_move_prob(board, avail);
    const max_prob = move_probs.flat().reduce((x, y, index) => (x[2] > y ? x : [index2pos(index, board)[0], index2pos(index, board)[1], y]), [-1, -1, 0]);
    return [max_prob[1], max_prob[0]];
};

// export default next_move;

//test
// const board = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 1, 2, 0], [0, 0, 3, 0, 0], [0, 0, 0, 0, 0]];
// console.log("board:", board);
// console.log("h,w", get_height(board), get_height(board));
// console.log("current player:", current_player(board));
// console.log("color board:", get_color_board(board));
// console.log("get state:", get_state(board));
// console.log("action:", get_action(board));
// console.log("board now:", get_board_now(board, 2));

// console.log("next move:", next_move(board));
// console.log("avail:", get_avail(board));
// console.log(Math.floor(3 / 2));
// console.log("num move:", get_num_move(board));
// console.log("init 3:", init_array3(3, 2, 1, -1));
// console.log("feature:", get_features(board).length);

// console.log("get blank type for move:", get_blank_types_for_move(board))
// const a: number[] = [1, 2, 3]
// let b = a.forEach((a) => { a })
// console.log(b)