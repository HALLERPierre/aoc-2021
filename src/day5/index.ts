import { getInput } from "../utils.ts";
import { z } from "zod";

const inputData = getInput({
    day: 5,
    parse: (input) => {
        return input.split("\n").filter((line) => line.length > 0).reduce<
            Array<{ x1: number; x2: number; y1: number; y2: number }>
        >((final, line) => {
            const [start, end] = line.replaceAll(" ", "").split("->");
            const [x1, y1] = start.split(",");
            const [x2, y2] = end.split(",");
            final.push({
                x1: parseInt(x1),
                x2: parseInt(x2),
                y1: parseInt(y1),
                y2: parseInt(y2),
            });
            return final;
        }, []);
    },
    schema: z.array(z.object({
        x1: z.number().int(),
        x2: z.number().int(),
        y1: z.number().int(),
        y2: z.number().int(),
    })),
});

export const step1 = (data: typeof inputData = inputData) => {
    const filteredData = data.filter((coords) =>
        coords.x1 === coords.x2 || coords.y1 === coords.y2
    );
    const hittedCoords: { [key: `x:${number}|y:${number}`]: number } = {};
    for (const coords of filteredData) {
        const startx = Math.min(coords.x1, coords.x2);
        const endx = Math.max(coords.x1, coords.x2);
        if (startx !== endx) {
            for (let x = startx; x <= endx; x++) {
                const key = `x:${x}|y:${coords.y1}` as const;
                hittedCoords[key] = hittedCoords[key] === undefined
                    ? 1
                    : hittedCoords[key] + 1;
            }
        }

        const starty = Math.min(coords.y1, coords.y2);
        const endy = Math.max(coords.y1, coords.y2);
        if (starty !== endy) {
            for (let y = starty; y <= endy; y++) {
                const key = `x:${coords.x1}|y:${y}` as const;
                hittedCoords[key] = hittedCoords[key] === undefined
                    ? 1
                    : hittedCoords[key] + 1;
            }
        }
    }

    return Object.values(hittedCoords).filter((count) => count >= 2).length;
};

export const step2 = (data: typeof inputData = inputData) => {
    const hittedCoords: { [key: `x:${number}|y:${number}`]: number } = {};
    for (const coords of inputData) {
        const startx = Math.min(coords.x1, coords.x2);
        const endx = Math.max(coords.x1, coords.x2);
        const starty = Math.min(coords.y1, coords.y2);
        const endy = Math.max(coords.y1, coords.y2);

        // Horizontal
        if (starty === endy) {
            for (let x = startx; x <= endx; x++) {
                const key = `x:${x}|y:${coords.y1}` as const;
                hittedCoords[key] = hittedCoords[key] === undefined
                    ? 1
                    : hittedCoords[key] + 1;
            }
            continue;
        }

        // Vertical
        if (startx === endx) {
            for (let y = starty; y <= endy; y++) {
                const key = `x:${coords.x1}|y:${y}` as const;
                hittedCoords[key] = hittedCoords[key] === undefined
                    ? 1
                    : hittedCoords[key] + 1;
            }
            continue;
        }

        // x1 : 9, y1 : 7 -> x2 : 7, y2 : 9
        // 9,7, 8,8, and 7,9
        // Diagonal down
        if (coords.y1 < coords.y2) {
            for (let y = starty, x = endx; y <= endy || x >= endx; y++, x--) {
                console.log(x);
                const key = `x:${x}|y:${y}` as const;
                hittedCoords[key] = hittedCoords[key] === undefined
                    ? 1
                    : hittedCoords[key] + 1;
            }
            continue;
        }

        // Diagonal up
        for (let y = endy, x = endx; y >= starty || x >= startx; y--, x--) {
            console.log(x);
            const key = `x:${x}|y:${y}` as const;
            hittedCoords[key] = hittedCoords[key] === undefined
                ? 1
                : hittedCoords[key] + 1;
        }
    }

    console.log(hittedCoords);
    return Object.values(hittedCoords).filter((count) => count >= 2).length;
};
