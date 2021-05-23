import ky from 'ky';
import { Options as KyOptions } from 'ky/distribution/types/options'
import { Parser } from './validation';

export interface Endpoint<Resp, Err> {
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  parseResp: Parser<Resp>,
  parseErr: Parser<Err>,
}

export interface EndpointWithBody<Req, Resp, Err> extends Endpoint<Resp, Err> {
  parseReq: Parser<Req>
};

export type Result<S, E> = {
  status: "success",
  data: S
} | {
  status: "error",
  data: E
};

export async function fetchEndpoint<
  Req,
  RawReq,
  Resp,
  Err,
  EP extends Endpoint<Resp, Err> | EndpointWithBody<Req, Resp, Err>
>(endpoint: EP, options?: { token?: string, body?: Req }): Promise<Result<Resp, Err>> {
  let kyOptions: KyOptions = {
    method: endpoint.method
  };
  if (options?.body != null) {
    kyOptions.json = options.body;
  }
  if (options?.token != null) {
    kyOptions.headers = { "Authorization": "Bearer " + options.token };
  }
  return ky(endpoint.path, kyOptions).json();
}
