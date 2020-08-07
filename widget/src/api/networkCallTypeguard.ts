/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */
import { AxiosResponse } from "axios";
import * as ioTs from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import { wrapNetworkCall } from "./networkCallWrapper";
import {isRight} from "fp-ts/lib/Either";

export function guardResponseType<A>(res: AxiosResponse<unknown>, Codec: ioTs.Type<A>): res is AxiosResponse<A> {
  return isRight(Codec.decode(res.data));
}

export function getCodecErrorReport<A>(res: AxiosResponse<unknown>, Codec: ioTs.Type<A>): string[] {
  return PathReporter.report(Codec.decode(res.data));
}

export function guardNetworkCall<ResponseDataType, ErrorType, DecodeErrorType extends Error>(
  networkCallFunction: () => Promise<AxiosResponse<unknown>>,
  Codec: ioTs.Type<ResponseDataType>,
  DecodeError: { new (...args: any[]): DecodeErrorType },
  transformError: (error: Error) => ErrorType | Promise<ErrorType>
) {
  return wrapNetworkCall<ResponseDataType, ErrorType | DecodeErrorType>(async () => {
    const response = await networkCallFunction();
    if (!guardResponseType(response, Codec)) {
      throw new DecodeError(getCodecErrorReport(response, Codec).join("\n\n"));
    }
    return response;
  }, transformError);
}
