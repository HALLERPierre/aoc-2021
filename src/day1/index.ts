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

export const step1 = (data: number[] = inputData) => {
    const frequency = data.reduce((final, current) => {
        return final + current;
    }, 0);
    return frequency;
};

export const step2 = (data: number[] = inputData) => {
    let frequency = 0;
    const frequencies = [0];
    let repeatedFrequency = null;
    let i = 0;
    while (repeatedFrequency === null) {
        const current = data[i % data.length];
        frequency += current;

        if (frequencies.includes(frequency)) {
            repeatedFrequency = frequency;
        } else {
            frequencies.push(frequency);
            i++;
        }
    }

    return repeatedFrequency;
};
