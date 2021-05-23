import { describe, expect, test } from '@jest/globals'
import { z } from 'zod';
import { Parser, ParseResult, zParser } from './validation';

describe('zParser', () => {
  test('parses correct objects', () => {
    interface Schema {
      username: string,
      pin: number
    }
    let schema = z.object({ username: z.string(), pin: z.number() });
    let parser: Parser<Schema> = zParser(schema);
    expect(parser({ username: "Hello", pin: 123 })).toStrictEqual({ success: true, data: { username: "Hello", pin: 123 } })
  })

  test('field error messages', () => {
    interface Schema {
      username: string,
      pin: number
    }
    let schema = z.object({ username: z.string(), pin: z.number().refine((x) => x >= 100 && x <= 999, "must be three digits") });
    let parser: Parser<Schema> = zParser(schema);
    expect(parser({ username: "Hello", pin: 1234 })).toStrictEqual(
      {
        success: false,
        formErrors: [],
        fieldErrors: {
          pin: ["must be three digits"]
        }
      })
  })

  test('form error messages', () => {
    type Schema = "LOGIN_FAILED" | "USER_NOT_FOUND";
    let schema = z.union([z.literal("LOGIN_FAILED"), z.literal("USER_NOT_FOUND")]);
    let parser: Parser<Schema> = zParser(schema);
    expect(parser("INVALID_USER")).toStrictEqual(
      {
        success: false,
        formErrors: ["Invalid input"],
        fieldErrors: {}
      })
  })
});
