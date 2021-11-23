import { compose, pipe, pipeline } from "ts-pipe-compose";
import { init_array2, init_array3, init_array4, get_chw, reshape2, reshape3, max, reshape1, nrange, on_board } from "./utils";
import { cnn1_weight, cnn1_bias, cnn2_weight, cnn2_bias, cnn3_weight, cnn3_bias, cnn4_weight, cnn4_bias } from './weight';

type tensor = number[][][];
type layer = (input: tensor) => tensor;

export const mycnn = (feature: tensor, weight: number[][][][], bias: number[], in_dim: number, out_dim: number, kernel_size: number = 3, padding: number = 0): tensor => {
    const [_, h, w] = get_chw(feature);
    const rg = nrange(-Math.floor(kernel_size / 2), Math.ceil(kernel_size / 2));
    const dirs = nrange(0, kernel_size * kernel_size).map(i => new Array(rg[Math.floor(i / kernel_size)], rg[i % kernel_size]));
    const res = init_array3(out_dim, h, w, 0);
    for (let c_out = 0; c_out < out_dim; ++c_out) {
        for (let nrow = 0; nrow < h; ++nrow) {
            for (let ncol = 0; ncol < w; ncol++) {
                res[c_out][nrow][ncol] = bias[c_out];
                for (let c_in = 0; c_in < in_dim; ++c_in) {
                    res[c_out][nrow][ncol] += dirs.reduce((prev, cur, i) => {
                        const x = nrow + cur[0], y = ncol + cur[1];
                        let feat = padding;
                        // console.log(on_board([x, y], feature[0]), x, y);
                        if (on_board([x, y], feature[0])) {
                            feat = feature[c_in][x][y];
                        }
                        const ker = weight[c_out][c_in][Math.floor(i / kernel_size)][i % kernel_size];
                        return feat * ker + prev;
                    }, 0);
                }
            }
        }
    }
    // console.log(res.length, res[0].length, res[0][0].length);
    return res;
};

const cnn1 = (feature: tensor): tensor => {
    return mycnn(feature, cnn1_weight, cnn1_bias, 47, 32, 3);
};

const cnn2 = (feature: tensor): tensor => {
    return mycnn(feature, cnn2_weight, cnn2_bias, 32, 32, 3);
};

const cnn3 = (feature: tensor): tensor => {
    return mycnn(feature, cnn3_weight, cnn3_bias, 32, 32, 3);
};

const cnn4 = (feature: tensor): tensor => {
    return mycnn(feature, cnn4_weight, cnn4_bias, 32, 1, 1);
};
const relu = (feature: tensor): tensor => {
    // console.dir("after cnn1");
    // console.dir(feature, { "maxArrayLength": null });
    const [c, h, w] = get_chw(feature);
    const relu_flat = (feature: tensor) => feature.flat(2).map(x => max(.0, x));
    return pipe(feature, relu_flat, reshape3(c, h, w));
};
const softmax = (feature: number[]): number[] => {
    const sum_exp = feature.reduce((x, y) => (x + Math.exp(y)), 0);
    return feature.map(x => Math.exp(x) / sum_exp);
};
export const network = pipeline(cnn1, relu, cnn2, relu, cnn3, relu, cnn4, reshape1(), softmax);


