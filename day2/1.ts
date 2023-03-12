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

const moveScoreMap: Record<Move, number> = {
  X: 1,
  Y: 2,
  Z: 3,
};
const opponentMoveScoreMap: Record<OpponentMove, number> = {
  A: 1,
  B: 2,
  C: 3,
};

const outcomeScoreMap = {
  loose: 0,
  draw: 3,
  win: 6,
};

export const getFileContents = () =>
  tryCatch(() => readFile(path.join(__dirname, "input.txt"), "utf-8"), toError);

const calcScore = (opMoveScore: number, moveScore: number) =>
  moveScore === opMoveScore
    ? outcomeScoreMap.draw
    : (opMoveScore % 3) + 1 === moveScore
    ? outcomeScoreMap.win
    : outcomeScoreMap.loose;

export const getMoveScore = ([opMove, move]: string[]) => {
  const moveScore = moveScoreMap[move as Move];
  const opMoveScore = opponentMoveScoreMap[opMove as OpponentMove];

  return moveScore + calcScore(opMoveScore, moveScore);
};

pipe(
  getFileContents(),
  map(flow(trim, split("\n"), A.map(flow(split(" "), getMoveScore)), sum)),
  getOrElseW(of),
  mapTask(console.log)
)();
