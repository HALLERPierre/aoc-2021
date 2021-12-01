import { getInput } from "../utils.ts";
import { z } from "zod";

const inputData = getInput({
    day: 1,
    parse: (input) =>
        input
            .split("\n")
            .map((item) => parseInt(item))
            .filter((number) => !isNaN(number)),
    schema: z.array(z.number().int()),
});

export const step1 = (data: number[] = inputData) => {
    const [, increasesCount] = data.reduce<[null | number, number]>(
        ([previousDepth, increases], depth) => {
            if (previousDepth === null || depth <= previousDepth) {
                return [depth, increases];
            }
            return [depth, increases + 1];
        },
        [null, 0]
    );
    return increasesCount;
};

export const step2 = (data: number[] = inputData) => {
    return data.reduce((count, depth, index, depths) => {
        if (index - 3 < 0) {
            return count;
        }
        return depths[index - 3] < depth ? count + 1 : count;
    }, 0);
};
