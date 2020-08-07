/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { AxiosError } from "axios";

export function isAxiosError(isError: any): isError is AxiosError {
  return !!isError && !!(isError as AxiosError).config;
}

export function isAxiosNetworkError(error: unknown) {
  return isAxiosError(error) && !error.response;
}

export function isAxiosServerError(error: unknown) {
  return isAxiosError(error) && error.response && (error.response.status >= 500 && error.response.status <= 599);
}
