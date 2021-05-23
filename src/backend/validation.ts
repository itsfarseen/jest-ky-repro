import { z } from 'zod';

export type ParseResult<Out> = {
  success: true,
  data: Out
} | {
  success: false,
  formErrors: string[],
  fieldErrors: { [field: string]: string[] }
}

export type Parser<Out> = (data: unknown) => ParseResult<Out>;

function zParse<Out, Def, In>(schema: z.Schema<Out, Def, In>, data: unknown): ParseResult<Out> {
  let res = schema.safeParse(data);
  if (res.success === true) {
    return { success: true, data: res.data };
  } else {
    let zerrors = res.error.flatten();
    return { success: false, ...zerrors };
  }
}

export function zParser<Out, Def, In>(schema: z.Schema<Out, Def, In>): Parser<Out> {
  return (data) => zParse<Out, Def, In>(schema, data)
}

export const dummyParser: Parser<{}> = (data: unknown) => { return { success: true, data: {} } }