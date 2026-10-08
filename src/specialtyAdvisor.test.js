import assert from "node:assert/strict";
import test from "node:test";
import { recommendSpecialty } from "./specialtyAdvisor.js";

test("suggests a cardiologist for heart symptoms", () => {
  assert.deepEqual(recommendSpecialty("I have heart palpitations"), {
    kind: "recommendation",
    specialty: "Cardiologist",
    alternatives: [],
  });
});

test("suggests a dermatologist for skin symptoms", () => {
  assert.equal(recommendSpecialty("itchy skin rash").specialty, "Dermatologist");
});

test("supports Telugu symptom keywords", () => {
  assert.equal(recommendSpecialty("నాకు తలనొప్పి ఉంది").specialty, "Neurologist");
});

test("prioritizes emergency guidance over a specialist suggestion", () => {
  assert.deepEqual(recommendSpecialty("fever and trouble breathing"), { kind: "urgent" });
});

test("returns an unknown result instead of guessing", () => {
  assert.deepEqual(recommendSpecialty("hello there"), { kind: "unknown" });
});

test("asks for symptoms when input is empty", () => {
  assert.deepEqual(recommendSpecialty("  "), { kind: "empty" });
});
