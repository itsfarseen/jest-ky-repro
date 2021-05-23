import { z } from 'zod';
import { zParser, dummyParser } from './validation';
import { EndpointWithBody, fetchEndpoint } from './index';
import { describe, expect, test } from '@jest/globals';

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
