import { z } from "zod";

const DaySchema = z.number().min(1).max(25);
const EventSchema = z.object({
    step1: z.function().returns(z.string().or(z.number())),
    step2: z.function().returns(z.string().or(z.number())),
});

const getSteps = async ({ DAY: unsafeDay } = process.env) => {
    if (unsafeDay === undefined) {
        throw new Error("Please specify a day");
    }
    const day = DaySchema.parse(parseInt(unsafeDay));
    const eventUnsafe = await import(`./day${day}`);

    return EventSchema.parse(eventUnsafe);
};

const main = async () => {
    const { step1, step2 } = await getSteps();

    const start1 = Date.now();
    const result1 = step1();
    const end1 = Date.now();
    console.log(`Step 1: ${result1}`);
    console.log(`Duration: ${end1 - start1}ms`);

    console.log("----");

    const start2 = Date.now();
    const result2 = step2();
    const end2 = Date.now();
    console.log(`Step 2: ${result2}`);
    console.log(`Duration: ${end2 - start2}ms`);
};

main();
