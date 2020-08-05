import * as assert from "assert";
import test from "baretest";
import { v1, v3, v4, v5 } from "uuid";
import { animals, names } from "./data";
import { fromUuid, toUuid, uuaf, fromUuaf } from "./index";

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

apiTests("there should be default way to crate UUAF", () => {
  const uuaf1 = uuaf();
});

apiTests("there should be a way to crate UUAF from all kinds of UUID", () => {
  const nsp = v1();
  const uuaf1 = uuaf.v1();
  const uuaf3 = uuaf.v3("name", nsp);
  const uuaf4 = uuaf.v4();
  const uuaf5 = uuaf.v5("name", nsp);
});

apiTests("there should be a way to crate UUAF from existing UUID", () => {
  const nsp = v1();
  const uuaf = fromUuid(nsp);
});

apiTests("there should be a way to crate UUID from existing UUAF", () => {
  const uuafS = uuaf.v1();
  const safeId = toUuid(uuafS);
  const unsafeId = toUuid(uuafS, false);
});

apiTests("there should be a way to change representation of UUAF", () => {
  const uuafLong = uuaf.v1();
  const shortFromLong = fromUuaf(uuafLong, "short");
  const rawFromShort = fromUuaf(shortFromLong, "raw");
  const longFromRaw = fromUuaf(rawFromShort, "long");
  assert.equal(uuafLong, longFromRaw);
});

const errorHandlingTests = test("ERRORS");

errorHandlingTests("invalid input to fromUuid should throw", () => {
  const invalid = "Something not ok";
  try {
    const x = fromUuid(invalid);
    assert.fail("Invalid input should throw");
  } catch (err) {
    assert.equal(err.message, "Invalid UUID");
  }
});

errorHandlingTests("invalid input to fromUuaf should throw", () => {
  const invalid = "Something not ok";
  try {
    fromUuaf(invalid, "short");
    assert.fail("Invalid input should throw");
  } catch (err) {
    assert.equal(err.message, "Invalid UUAF (length)");
  }
});

errorHandlingTests("invalid input to fromUuaf should throw", () => {
  const invalid =
    "Formula INVALID: trout Dennis + swan Danielle = earwig Kathleen (planet d7bc3eca1ee7 only)";
  try {
    fromUuaf(invalid, "short");
    assert.fail("Invalid input should throw");
  } catch (err) {
    assert.equal(err.message, "Invalid UUAF (recipe id)");
  }
});

errorHandlingTests("invalid input to fromUuaf should throw", () => {
  const invalid =
    "Formula 106a16a0: trout Dennis + swan Danielle = earwig Kathleen (planet INVALID only)";
  try {
    fromUuaf(invalid, "short");
    assert.fail("Invalid input should throw");
  } catch (err) {
    assert.equal(err.message, "Invalid UUAF (planet id)");
  }
});

errorHandlingTests("invalid input to fromUuaf should throw", () => {
  const invalid =
    "Formula 106a16a0: INVALID Dennis + swan Danielle = earwig Kathleen. (planet d7bc3eca1ee7 only)";
  try {
    fromUuaf(invalid, "short");
    assert.fail("Invalid input should throw");
  } catch (err) {
    assert.equal(err.message, "Invalid UUAF (animal kind)");
  }
});

errorHandlingTests("invalid input to fromUuaf should throw", () => {
  const invalid =
    "Formula 106a16a0: trout INVALID + swan Danielle = earwig Kathleen. (planet d7bc3eca1ee7 only)";
  try {
    fromUuaf(invalid, "short");
    assert.fail("Invalid input should throw");
  } catch (err) {
    assert.equal(err.message, "Invalid UUAF (name)");
  }
});

const runAllTests = async () => {
  await dataTests.run();
  await logicTests.run();
  await apiTests.run();
  await errorHandlingTests.run();
};

runAllTests();
