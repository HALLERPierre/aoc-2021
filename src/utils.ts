import { z } from "zod";

type GetInput<T> = {
    day: number;
    parse: (input: string) => T;
    schema: z.Schema<T>;
};

export function getInput<T>({ day, parse, schema }: GetInput<T>): T {
    const input = Deno.readTextFileSync(`src/day${day}/input`).toString();
    const data = parse(input);
    return schema.parse(data);
}
