import { getInput } from "../utils.ts";
import { z } from "zod";

const inputData = getInput({
    day: 3,
    parse: (input) =>
        input
            .split("\n")
            .map((item) => item.split("") as ("1" | "0")[]).filter((command) =>
                command.length > 0
            ),
    schema: z.array(z.array(z.enum(["0", "1"]))),
});

const transpose = (data: typeof inputData) => {
    return data[0].map((_, colIndex) => data.map((row) => row[colIndex]));
};

export const step1 = (data: typeof inputData = inputData) => {
    const transposed = transpose(data);
    const gammaRate = transposed.map((line) => {
        const sum = line.reduce((sum, item) => sum + parseInt(item), 0);
        return sum > line.length / 2 ? 1 : 0;
    });
    const epsylonRate = gammaRate.map((rate) => rate === 1 ? 0 : 1);
    return parseInt(gammaRate.join(""), 2) * parseInt(epsylonRate.join(""), 2);
};

export const step2 = (data: typeof inputData = inputData) => {
    const [o2rating, co2rating] = computeRatings(data);
    return o2rating * co2rating;
};

const getCurrentCriteria = (data: typeof inputData, index: number) => {
    const currentColumn = transpose(data)[index];
    const sum = currentColumn.reduce((sum, item) => sum + parseInt(item), 0);
    return sum >= currentColumn.length / 2 ? 1 : 0;
};

const computeRatings = (data: typeof inputData) => {
    let columnIndex = 0;
    let oxygenLines = data;
    let dioxigenLines = data;
    let oxygenLine: typeof inputData[0] | null = null;
    let dioxygenLine: typeof inputData[0] | null = null;
    while (
        columnIndex < data.length - 1 &&
        (dioxygenLine === null || oxygenLine === null)
    ) {
        const oxygenCriteria = getCurrentCriteria(oxygenLines, columnIndex);
        const dioxygenCriteria = getCurrentCriteria(dioxigenLines, columnIndex);
        if (oxygenLine === null) {
            oxygenLines = oxygenLines.filter((line) =>
                line[columnIndex] === oxygenCriteria.toString()
            );
        }
        if (dioxygenLine === null) {
            dioxigenLines = dioxigenLines.filter((line) =>
                line[columnIndex] !== dioxygenCriteria.toString()
            );
        }

        if (dioxigenLines.length === 1) {
            [dioxygenLine] = dioxigenLines;
        }
        if (oxygenLines.length === 1) {
            [oxygenLine] = oxygenLines;
        }

        columnIndex++;
    }

    if (oxygenLine === null || dioxygenLine === null) {
        throw new Error("unable to find o2 and co2 rating");
    }

    return [
        parseInt(oxygenLine.join(""), 2),
        parseInt(dioxygenLine.join(""), 2),
    ];
};
