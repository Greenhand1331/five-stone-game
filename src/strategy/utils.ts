export const init_array2 = (d1: number, d2: number, val: number): number[][] => new Array<number>(d1).fill(val).map(() => new Array<number>(d2).fill(val));

export const init_array3 = (d1: number, d2: number, d3: number, val: number): number[][][] => new Array<number>(d1).fill(val).map(() => new Array<number>(d2).fill(val).map(() => new Array<number>(d3).fill(val)));

export const init_array4 = (d1: number, d2: number, d3: number, d4: number, val: number): number[][][][] => new Array<number>(d1).fill(val).map(() => new Array<number>(d2).fill(val).map(() => new Array<number>(d3).fill(val).map(() => new Array<number>(d4).fill(val))));

export const reshape1 = () => (mat: number[][][]): number[] => mat.flat(2);
export const reshape2 = (d1: number, d2: number) => {
    return (mat: number[]) => {
        let res = init_array2(d1, d2, 0);
        mat.forEach((val, index) => {
            res[Math.floor(index / d2)][index % d2] = val;
        });
        return res;
    };
};
export const reshape3 = (d1: number, d2: number, d3: number) => {
    return (mat: number[]) => {
        let res = init_array3(d1, d2, d3, 0);
        mat.forEach((val, index) => {
            res[Math.floor(index / (d2 * d3))][Math.floor(index % (d2 * d3) / d3)][index % d3] = val;
        });
        return res;
    };
};
export const get_height = (board: number[][]): number => board.length;
export const get_width = (board: number[][]): number => board[0].length;
export const current_player = (board: number[][]): number => board.flat().reduce((a, b) => max(a, b), 0) % 2 == 0 ? 1 : -1;
export const get_color = (val: number): number => val == 0 ? 0 : val % 2 == 1 ? 1 : -1;
export const type_idx_for_color = (color: number): number => color == 1 ? 0 : 1;
export const max = (a: number, b: number): number => a > b ? a : b;
export const get_color_board = (board: number[][]) => board.map(row => row.map(val => get_color(val)));
export const get_board_now = (board: number[][], num: number): number[][] => board.map(row => row.map(val => val <= num ? val : 0));
export const on_board = (pos: number[], board: number[][]): Boolean => 0 <= pos[0] && pos[0] < get_height(board) && 0 <= pos[1] && pos[1] < get_width(board);
export const nrange = (start: number, end: number, step: number = 1): number[] => {
    const len = Math.ceil((end - start) / step);
    return new Array<number>(len).fill(0).map((_, i) => start + i * step);
};
export const index2pos = (index: number, board: number[][]): [number, number] => {
    const h = get_height(board), w = get_width(board);
    return [Math.floor(index / w), index % w];
};
export const pos2index = (pos: number[], board: number[][]): number => {
    const w = get_width(board);
    return pos[0] * w + pos[1];
};
export const get_chw = (mat: number[][][]): [number, number, number] => [mat.length, mat[0].length, mat[0][0].length];
export const get_hw = (mat: number[][]): [number, number] => [mat.length, mat[0].length];