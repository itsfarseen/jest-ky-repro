import { rest } from 'msw';
import { z } from 'zod';
import { zParser, dummyParser } from './validation';
import { EndpointWithBody, fetchEndpoint } from './index';
import { describe, expect, test } from '@jest/globals';

const handlers = [
  rest.post('http://localhost/auth/login_failed', (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        success: false,
        data: "LOGIN_FAILED"
      })
    );
  }),
  rest.post('http://localhost/auth/login_failed_invalid', (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        success: false,
        data: "INVALID_ERROR_CODE"
      })
    );
  }),
  rest.post('http://localhost/auth/login_success', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          token: "1234"
        }
      })
    );
  }),
  rest.post('http://localhost/auth/login_success_invalid', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          token: 1234
        }
      })
    );
  })
]

const endpoint: EndpointWithBody<{}, { token: string }, "LOGIN_FAILED"> = {
  path: "",
  method: "POST",
  parseReq: dummyParser,
  parseResp: zParser(z.object({
    token: z.string()
  })),
  parseErr: zParser(z.literal("LOGIN_FAILED"))
}

describe("fetchEndpoint", () => {
  test("Login Success", async () => {
    let res = await fetchEndpoint({ ...endpoint, path: "http://localhost/auth/login_success" })
    expect(res).toStrictEqual({ success: true, data: { token: "1234" } })
  })

  test("Login Success - validation error", async () => {
    let res = await fetchEndpoint({ ...endpoint, path: "http://localhost/auth/login_success_invalid" })
    expect(res).toStrictEqual({ success: true, data: { token: "1234" } })
  })

  test("Login Failed", async () => {
    let res = await fetchEndpoint({ ...endpoint, path: "http://localhost/auth/login_failed" })
    expect(res).toStrictEqual({ success: false, data: "LOGIN_FAILED" })
  })

  test("Login Failed - validation error", async () => {
    let res = await fetchEndpoint({ ...endpoint, path: "http://localhost/auth/login_failed_invalid" })
    expect(res).toStrictEqual({ success: false, data: "LOGIN_FAILED" })
  })

})
