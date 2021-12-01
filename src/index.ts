import { z } from "zod";
import { days } from "./days.ts";

const DaySchema = z.number().min(1).max(25);
const EventSchema = z.object({
    step1: z.function().returns(z.string().or(z.number())),
    step2: z.function().returns(z.string().or(z.number())),
});

const getSteps = async (unsafeDay?: string) => {
    if (unsafeDay === undefined) {
        throw new Error("Please specify a day");
    }
    const nDay = DaySchema.parse(parseInt(unsafeDay));
    const key = `day${nDay}`;
    if (!(key in days)) {
        throw new Error(`${key} not found :(`);
    }
    const day = days[key as keyof typeof days];
    return EventSchema.parse(day);
};

const main = async () => {
    const { step1, step2 } = await getSteps(Deno.env.get("DAY"));

    const start1 = Date.now();
    const result1 = step1();
    const end1 = Date.now();
    console.log(`Step 1: ${result1}`);
    console.log(`Duration: ${end1 - start1}ms`);

    console.log("\n----\n");

    const start2 = Date.now();
    const result2 = step2();
    const end2 = Date.now();

    console.log(`Step 2: ${result2}`);
    console.log(`Duration: ${end2 - start2}ms`);
};

main();
