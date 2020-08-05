import * as uuid from "uuid";
import * as u from "uuid/interfaces";
import { animals, names } from "./data";

export type UUAF = {
  recipeId: string;
  firstIngredient: { kind: string; name: string };
  secondIngredient: { kind: string; name: string };
  result: { kind: string; name: string };
  planetId: string;
};

export const uuaf = Object.assign(uuafV4, {
  v1: uuafV1,
  v3: uuafV3,
  v4: uuafV4,
  v5: uuafV5,
});

export function fromUuid(id: string, kind?: UUAFString): string;
export function fromUuid(id: string, kind: UUAFRaw): UUAF;
export function fromUuid(id: string, kind: UUAFKind = "long") {
  const parsed = uuid.parse(id);

  const recipeId = id.substring(0, 8);
  const animal1 = animals[parsed[4]];
  const name1 = names[parsed[5]];
  const animal2 = animals[parsed[6]];
  const name2 = names[parsed[7]];
  const animal3 = animals[parsed[8]];
  const name3 = names[parsed[9]];
  const planetId = id.substring(24);

  const uuaf = {
    recipeId,
    firstIngredient: { kind: animal1, name: name1 },
    secondIngredient: { kind: animal2, name: name2 },
    result: { kind: animal3, name: name3 },
    planetId,
  };

  switch (kind) {
    case "raw":
      return uuaf;
    case "short":
      return getShortString(uuaf);
    case "long":
      return getLongString(uuaf);
  }
}

export function toUuid(uuaf: string, check: boolean = true) {
  const parsed = parseUuaf(uuaf, check);
  const bytes = [];
  bytes.push(...pairwise(parsed.recipeId).map((x) => parseInt(x, 16)));
  bytes.push(animals.indexOf(parsed.firstIngredient.kind));
  bytes.push(names.indexOf(parsed.firstIngredient.name));
  bytes.push(animals.indexOf(parsed.secondIngredient.kind));
  bytes.push(names.indexOf(parsed.secondIngredient.name));
  bytes.push(animals.indexOf(parsed.result.kind));
  bytes.push(names.indexOf(parsed.result.name));
  bytes.push(...pairwise(parsed.planetId).map((x) => parseInt(x, 16)));

  return uuid.stringify(bytes);
}

export function fromUuaf(
  uuaf: string,
  kind: UUAFString,
  check?: boolean
): string;
export function fromUuaf(uuaf: string, kind: UUAFRaw, check?: boolean): UUAF;
export function fromUuaf(uuaf: UUAF, kind: UUAFString, check?: boolean): string;
export function fromUuaf(
  uuaf: string | UUAF,
  kind: UUAFKind,
  check: boolean = true
) {
  const parsed = typeof uuaf === "string" ? parseUuaf(uuaf, check) : uuaf;
  switch (kind) {
    case "raw":
      return parsed;
    case "long":
      return getLongString(parsed);
    case "short":
      return getShortString(parsed);
  }
}

type UUAFString = "short" | "long";
type UUAFRaw = "raw";
type UUAFKind = UUAFString | UUAFRaw;

function uuafV1(opts?: u.V1Options & { kind: UUAFString }): string;
function uuafV1(opts?: u.V1Options & { kind: UUAFRaw }): UUAF;
function uuafV1(
  opts: u.V1Options & {
    kind: UUAFKind;
  } = { kind: "long" }
) {
  const id = uuid.v1(opts);
  if (opts.kind === "raw") {
    return fromUuid(id, "raw");
  }
  return fromUuid(id, opts.kind);
}

function uuafV3(
  name: string | u.InputBuffer,
  nsp: string | u.InputBuffer
): string;
function uuafV3(
  name: string | u.InputBuffer,
  nsp: string | u.InputBuffer,
  kind: UUAFString
): string;
function uuafV3(
  name: string | u.InputBuffer,
  nsp: string | u.InputBuffer,
  kind: UUAFRaw
): UUAF;
function uuafV3(
  name: string | u.InputBuffer,
  nsp: string | u.InputBuffer,
  kind: UUAFKind = "long"
) {
  const id = uuid.v3(name, nsp);
  if (kind === "raw") {
    return fromUuid(id, "raw");
  }
  return fromUuid(id, kind);
}

function uuafV4(
  opts?: u.V4Options & {
    kind: UUAFString;
  }
): string;
function uuafV4(opts?: u.V4Options & { kind: UUAFRaw }): UUAF;
function uuafV4(
  opts: u.V4Options & { kind: UUAFKind } = {
    kind: "long",
  }
) {
  const id = uuid.v4(opts);
  if (opts.kind === "raw") {
    return fromUuid(id, "raw");
  }
  return fromUuid(id, opts.kind);
}

function uuafV5(
  name: string | u.InputBuffer,
  nsp: string | u.InputBuffer,
  kind?: UUAFString
): string;
function uuafV5(
  name: string | u.InputBuffer,
  nsp: string | u.InputBuffer,
  kind: UUAFRaw
): UUAF;
function uuafV5(
  name: string | u.InputBuffer,
  nsp: string | u.InputBuffer,
  kind: UUAFKind = "long"
) {
  const id = uuid.v5(name, nsp);
  if (kind === "raw") {
    return fromUuid(id, "raw");
  }
  return fromUuid(id, kind);
}

const getShortString = ({
  recipeId,
  firstIngredient,
  secondIngredient,
  result,
  planetId,
}: UUAF) =>
  `${recipeId}-${firstIngredient.kind}-${firstIngredient.name}-${secondIngredient.kind}-${secondIngredient.name}-${result.kind}-${result.name}-${planetId}`;

const getLongString = ({
  recipeId,
  firstIngredient,
  secondIngredient,
  result,
  planetId,
}: UUAF) =>
  `Formula ${recipeId}: ${firstIngredient.kind} ${firstIngredient.name} + ${secondIngredient.kind} ${secondIngredient.name} = ${result.kind} ${result.name} (planet ${planetId} only)`;

const parseUuaf = (uuaf: string, check: boolean): UUAF => {
  let splitted;
  if (uuaf.indexOf("Formula ") === 0) {
    splitted = uuaf
      .replace("Formula", "")
      .replace(/[\.:+=\(\)]/g, "")
      .replace("planet ", "")
      .replace(" only", "")
      .split(" ")
      .filter((x) => x !== "");
  } else {
    splitted = uuaf.split("-");
  }

  if (splitted.length !== 8) {
    throw new TypeError("Invalid UUAF (length)");
  }

  const recipeId = splitted[0];
  const planetId = splitted[7];
  const kinds = [splitted[1], splitted[3], splitted[5]];
  const parsedNames = [splitted[2], splitted[4], splitted[6]];

  if (check) {
    if (recipeId.length !== 8 || !/[0-9A-Fa-f]{8}/.test(recipeId)) {
      throw new TypeError("Invalid UUAF (recipe id)");
    }

    if (planetId.length !== 12 || !/[0-9A-Fa-f]{12}/.test(planetId)) {
      throw new TypeError("Invalid UUAF (planet id)");
    }

    if (kinds.some((kind) => !animals.includes(kind))) {
      throw new TypeError("Invalid UUAF (animal kind)");
    }

    if (parsedNames.some((name) => !names.includes(name))) {
      throw new TypeError("Invalid UUAF (name)");
    }
  }
  return {
    recipeId,
    planetId,
    firstIngredient: { kind: kinds[0], name: parsedNames[0] },
    secondIngredient: { kind: kinds[1], name: parsedNames[1] },
    result: { kind: kinds[2], name: parsedNames[2] },
  };
};

const pairwise = (arr: string) => {
  const result = [];
  for (let i = 0; i < arr.length; i += 2) {
    result.push(arr[i] + arr[i + 1] ?? "");
  }
  return result;
};
