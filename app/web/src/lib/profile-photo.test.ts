import { strict as assert } from "node:assert";
import { getProfilePhotoError, maxProfilePhotoBytes } from "./profile-photo";

assert.equal(getProfilePhotoError({ size: 120_000, type: "image/jpeg" }), "");
assert.equal(getProfilePhotoError({ size: 120_000, type: "image/png" }), "");
assert.ok(getProfilePhotoError({ size: 120_000, type: "application/pdf" }).includes("이미지"));
assert.ok(getProfilePhotoError({ size: maxProfilePhotoBytes + 1, type: "image/jpeg" }).includes("2MB"));
