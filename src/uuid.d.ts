import * as uuid from "uuid";

declare module "uuid" {
  function parse(uuid: string): Uint8Array;
  function stringify(buffer: number[]): string;
}
