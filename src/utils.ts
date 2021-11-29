import { readFileSync } from "fs";
import { z } from "zod";

type GetInput<T> = {
    day: number;
    parse: (input: string) => T;
    schema: z.Schema<T>;
};

export function getInput<T>({ day, parse, schema }: GetInput<T>): T {
    const input = readFileSync(`${__dirname}/day${day}/input`).toString();
    const data = parse(input);
    schema.parse(data);

    return data;
}
