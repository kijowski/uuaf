import * as assert from "assert";
import test from "baretest";
import { v1, v3, v4, v5 } from "uuid";
import { animals, names } from "./data";
import {
  fromUuid,
  toUuid,
  uuafV1,
  uuafV3,
  uuafV4,
  uuafV5,
  fromUuaf,
} from "./index";

const unique = <T>(arr: T[]) => [...new Set(arr)];

const dataTests = test("DATA");

dataTests("animals should have 256 unique items", () => {
  assert.equal(unique(animals).length, 256);
});

dataTests("names should have 256 unique items", () => {
  assert.equal(unique(names).length, 256);
});

const logicTests = test("LOGIC");

logicTests("encoding uuid v1 to uuaf should be reversible", () => {
  const id = v1();
  const uuaf = fromUuid(id);
  const result = toUuid(uuaf);
  assert.equal(id, result);
});

logicTests("encoding uuid v3 to uuaf should be reversible", () => {
  const nsp = v1();
  const id = v3("name", nsp);
  const uuaf = fromUuid(id);
  const result = toUuid(uuaf);
  assert.equal(id, result);
});

logicTests("encoding uuid v4 to uuaf should be reversible", () => {
  const id = v4();
  const uuaf = fromUuid(id);
  const result = toUuid(uuaf);
  assert.equal(id, result);
});

logicTests("encoding uuid v5 to uuaf should be reversible", () => {
  const nsp = v1();
  const id = v5("name", nsp);
  const uuaf = fromUuid(id);
  const result = toUuid(uuaf);
  assert.equal(id, result);
});

const apiTests = test("API");

apiTests("there should be a way to crate UUAF from all kinds of UUID", () => {
  const nsp = v1();
  const uuaf1 = uuafV1();
  const uuaf3 = uuafV3("name", nsp);
  const uuaf4 = uuafV4();
  const uuaf5 = uuafV5("name", nsp);
});

apiTests("there should be a way to crate UUAF from existing UUID", () => {
  const nsp = v1();
  const uuaf = fromUuid(nsp);
});

apiTests("there should be a way to crate UUID from existing UUAF", () => {
  const uuaf = uuafV1();
  const safeId = toUuid(uuaf);
  const unsafeId = toUuid(uuaf, false);
});

apiTests("there should be a way to change representation of UUAF", () => {
  const uuafLong = uuafV1();
  const shortFromLong = fromUuaf(uuafLong, "short");
  const rawFromShort = fromUuaf(shortFromLong, "raw");
  const longFromRaw = fromUuaf(rawFromShort, "long");
  assert.equal(uuafLong, longFromRaw);
});

const runAllTests = async () => {
  await dataTests.run();
  await logicTests.run();
  await apiTests.run();
};

runAllTests();
