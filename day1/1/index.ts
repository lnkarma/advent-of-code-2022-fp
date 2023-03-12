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
import { apply, max, reject, split, sum } from "ramda";

export const getFileContents = () =>
  tryCatch(
    () => readFile(path.join(__dirname, "..", "input.txt"), "utf-8"),
    toError
  );

pipe(
  getFileContents(),
  map(
    flow(
      split("\n\n"),
      A.map(flow(split("\n"), A.map(parseInt), reject(isNaN), sum)),
      apply(Math.max)
    )
  ),
  getOrElseW(of),
  mapTask(console.log)
)();
