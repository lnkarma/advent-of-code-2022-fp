import * as A from "fp-ts/lib/Array";
import { toError, fold } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { tryCatch, map, match, matchEW } from "fp-ts/lib/TaskEither";
import { readFile } from "fs/promises";
import path, { dirname } from "path";
import { split, sum,  } from "ramda";

export const getFileContents = () =>
  tryCatch(() => readFile(path.join(__dirname, "input.txt"), "utf-8"), toError);

const a = pipe(
  getFileContents(),
  map(flow(split("\n\n"), A.map(flow(split("\n"), A.map(parseInt), sum))))
)().then(flow(fold(console.log, console.log)));
