import { getInput } from "../utils.ts";
import { z } from "zod";

const inputData = getInput({
    day: 2,
    parse: (input) =>
        input
            .split("\n")
            .map((item) =>
                item.split(" ") as [("forward" | "down" | "up"), number]
            ).filter((command) => command.length === 2),
    schema: z.array(
        z.tuple([
            z.enum(["forward", "down", "up"]),
            z.preprocess((a) => parseInt(a as string, 10), z.number().int()),
        ]),
    ),
});

export const step1 = (data: typeof inputData = inputData) => {
    const [x, y] = data.reduce(([x, y], [direction, metric]) => {
        switch (direction) {
            case "down":
                return [x, y + metric];
            case "up":
                return [x, y - metric];
            case "forward":
                return [x + metric, y];
        }
    }, [0, 0]);
    return x * y;
};

export const step2 = (data: typeof inputData = inputData) => {
    const [_, x, y] = data.reduce(([aim, x, y], [direction, metric]) => {
        switch (direction) {
            case "down":
                return [aim + metric, x, y];
            case "up":
                return [aim - metric, x, y];
            case "forward":
                return [aim, x + metric, y + metric * aim];
        }
    }, [0, 0, 0]);
    return x * y;
};
