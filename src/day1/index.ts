import { getInput } from "../utils";
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

const getIncreasesCount = (depths: number[]) => {
    const [, increasesCount] = depths.reduce<[null | number, number]>(
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

export const step1 = (data: number[] = inputData) => {
    return getIncreasesCount(data);
};

export const step2 = (data: number[] = inputData) => {
    const windows = data.reduce<Array<[number?, number?, number?]>>(
        (windows, depth, index) => {
            const windowsIndexes = [index, index - 1, index - 2];
            windowsIndexes.forEach((windowIndex) => {
                if (windowIndex >= 0) {
                    windows[windowIndex] === undefined
                        ? (windows[windowIndex] = [depth])
                        : windows[windowIndex].push(depth);
                }
            });
            return windows;
        },
        []
    );

    const validWindows = windows.filter(
        (window) => window.length === 3
    ) as Array<[number, number, number]>;

    const windowsDepths = validWindows.reduce<number[]>((depths, window) => {
        const sum = window.reduce<number>((sum, depth) => sum + depth, 0);
        depths.push(sum);
        return depths;
    }, []);

    return getIncreasesCount(windowsDepths);
};
