import { z } from 'zod';
import { EndpointWithBody } from '.';
import { Parser, zParser } from './validation';

type LoginReq = {
  username: string,
  password: string
}
type LoginResp = {
  name: string,
  userid: string,
  token: string
}
type LoginErr = "LOGIN_FAILED";

const loginReqParser: Parser<LoginReq> = zParser(z.object({
  username: z.string(),
  password: z.string()
}));
const loginRespParser: Parser<LoginResp> = zParser(z.object({
  name: z.string(),
  userid: z.string(),
  token: z.string()
}));
const loginErrParser: Parser<LoginErr> = zParser(z.literal("LOGIN_FAILED"));

export const Login: EndpointWithBody<LoginReq, LoginResp, LoginErr> = {
  path: "/auth/login",
  method: "POST",
  parseReq: loginReqParser,
  parseResp: loginRespParser,
  parseErr: loginErrParser,
}
