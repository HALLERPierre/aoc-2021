import { getInput } from "../utils.ts";
import { z } from "zod";

const inputData = getInput({
    day: 4,
    parse: (input) => {
        const [drawnRaw, ...boardsRaws] = input.split("\n\n");
        const drawn = drawnRaw.split(",").map((number) => parseInt(number, 10))
            .filter((number) => !isNaN(number));

        const boards = boardsRaws.map((board) =>
            board.split("\n").map((line) =>
                line.split(" ").map((number) => parseInt(number, 10)).filter((
                    number,
                ) => !isNaN(number))
            ).filter((board) => board.length > 0)
        );

        return { drawn, boards };
    },
    schema: z.object({
        drawn: z.array(z.number().int()),
        boards: z.array(
            z.array(z.array(z.number().int())),
        ),
    }),
});

const formatBoards = (boards: typeof inputData["boards"]) =>
    boards.map((board) => ({
        lines: board,
        column: board.reduce<number[][]>((columns, _line, index, curBoard) => {
            const column = [];
            for (let i = 0; i < curBoard.length; i++) {
                const element = curBoard[i][index];
                column.push(element);
            }
            columns.push(column);
            return columns;
        }, []),
    }));

const isWinner = (
    board: ReturnType<typeof formatBoards>[0],
    drawn: number[],
) => {
    return board.lines.some((line) =>
        line.every((number) => drawn.includes(number))
    ) || board.column.some((line) =>
        line.every((number) =>
            drawn.includes(number)
        )
    );
};

export const step1 = ({ drawn, boards }: typeof inputData = inputData) => {
    const formatedBoards = formatBoards(boards);
    let winner = null;
    let i = 0;
    const drawnNumbers: number[] = [];
    while (winner === null && i < drawn.length) {
        drawnNumbers.push(drawn[i]);

        const winningBoard = formatedBoards.reduce<
            typeof boards[0] | null
        >((previous, formatedBoard, index) => {
            if (previous !== null) {
                return previous;
            }
            if (isWinner(formatedBoard, drawnNumbers)) {
                return boards[index];
            }
            return previous;
        }, null);

        winner = winningBoard;
        i++;
    }
    if (winner === null) {
        throw new Error("unable to find winner");
    }
    const boardScore = winner.flat().filter((number) =>
        !drawnNumbers.includes(number)
    ).reduce((sum, number) => sum + number, 0);

    return boardScore * drawnNumbers[drawnNumbers.length - 1];
};

export const step2 = ({ drawn, boards }: typeof inputData = inputData) => {
    const formatedBoards = formatBoards(boards);
    let winner = null;
    let drawnNumberWinner: number[] = [];
    let i = 0;
    const drawnNumbers: number[] = [];
    let winningBoardsIndexes: number[] = [];

    while (i < drawn.length) {
        drawnNumbers.push(drawn[i]);

        const [winningBoards, boardIndexex] = formatedBoards.reduce<
            [typeof boards[0][] | null, number[] | null]
        >((previous, formatedBoard, index) => {
            if (
                !winningBoardsIndexes.includes(index) &&
                isWinner(formatedBoard, drawnNumbers)
            ) {
                previous[0] = [...previous[0] ?? [], boards[index]];
                previous[1] = [...previous[1] ?? [], index];
            }
            return previous;
        }, [null, null]);

        if (boardIndexex !== null && winningBoards !== null) {
            winningBoardsIndexes = [...winningBoardsIndexes, ...boardIndexex];
            winner = winningBoards[winningBoards.length - 1];
            drawnNumberWinner = [...drawnNumbers];
        }

        i++;
    }

    if (winner === null) {
        throw new Error("unable to find winner");
    }

    const boardScore = winner.flat().filter((number) =>
        !drawnNumberWinner.includes(number)
    ).reduce((sum, number) => sum + number, 0);

    return boardScore * drawnNumberWinner[drawnNumberWinner.length - 1];
};
