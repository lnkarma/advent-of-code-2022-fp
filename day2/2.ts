import * as A from "fp-ts/lib/Array";
import { toError, fold } from "fp-ts/lib/Either";
import { flow, identity, pipe } from "fp-ts/lib/function";
import { of, map as mapTask } from "fp-ts/lib/Task";
import {
  tryCatch,
  map,
  match,
  matchEW,
  mapLeft,
  getOrElse,
  getOrElseW,
  bimap,
  orElseFirst,
  orElse,
  orElseW,
} from "fp-ts/lib/TaskEither";
import { readFile } from "fs/promises";
import path, { dirname } from "path";
import { apply, max, reject, split, sum, trim } from "ramda";

type Move = "X" | "Y" | "Z";
type OpponentMove = "A" | "B" | "C";

const strategyMap: Record<
  Move,
  {
    direction: number;
    outcomeScore: number;
  }
> = {
  X: {
    direction: -1,
    outcomeScore: 0,
  },
  Y: {
    direction: 0,
    outcomeScore: 3,
  },
  Z: {
    direction: 1,
    outcomeScore: 6,
  },
};
const opponentMoveScoreMap: Record<OpponentMove, number> = {
  A: 1,
  B: 2,
  C: 3,
};

const moveValues = [1, 2, 3];

export const getFileContents = () =>
  tryCatch(() => readFile(path.join(__dirname, "input.txt"), "utf-8"), toError);

const calcScore = (opMoveScore: number, move: string) => {
  const opMoveIndex = opMoveScore - 1;
  const { direction, outcomeScore } = strategyMap[move as Move];
  const moveScorea =
    direction === 0
      ? opMoveScore
      : direction < 0
      ? moveValues.at(opMoveIndex - 1) || 0
      : (opMoveScore % 3) + 1;
  return moveScorea + outcomeScore;
};

export const getMoveScore = ([opMove, move]: string[]) => {
  const opMoveScore = opponentMoveScoreMap[opMove as OpponentMove];

  return calcScore(opMoveScore, move);
};

pipe(
  getFileContents(),
  map(flow(trim, split("\n"), A.map(flow(split(" "), getMoveScore)), sum)),
  getOrElseW(of),
  mapTask(console.log)
)();
