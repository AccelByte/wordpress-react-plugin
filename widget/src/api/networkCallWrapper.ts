/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { AxiosError, AxiosResponse } from "axios";

export type WrapperResultSuccess<ResponseDataType> = {
  response: AxiosResponse<ResponseDataType>;
  error: null;
};

export type WrapperResultError<ErrorType> = {
  response: null;
  error: ErrorType | AxiosError;
};

export type WrapperResult<ResponseDataType, ErrorType> =
  | WrapperResultSuccess<ResponseDataType>
  | WrapperResultError<ErrorType>;

export async function wrapNetworkCall<ResponseDataType, ErrorType>(
  networkCallFunction: () => Promise<AxiosResponse<ResponseDataType>>,
  transformError: (error: Error) => Promise<ErrorType> | ErrorType
): Promise<WrapperResult<ResponseDataType, ErrorType>> {
  try {
    const response = await networkCallFunction();
    return { response, error: null };
  } catch (error) {
    try {
      return { response: null, error: await transformError(error) };
    } catch (errorHandlerException) {
      console.error(`NetworkCallWrapperException: `, errorHandlerException);
      return Promise.resolve({ response: null, error });
    }
  }
}
