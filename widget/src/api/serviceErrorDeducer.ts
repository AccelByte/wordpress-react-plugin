/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { isAxiosError } from "./errorDeducer";
import { IAMError, ServiceError } from "./user/models/user";
import {isRight} from "fp-ts/lib/Either";

export function extractServiceErrorCode(error: Error): number | null {
  if (error && isAxiosError(error) && error.response && error.response.data) {
    const errorData = error.response.data;

    const serviceError = ServiceError.decode(errorData);
    if (isRight(serviceError)) return serviceError.right.errorCode;

    const iamError = IAMError.decode(errorData);
    if (isRight(iamError)) return iamError.right.ErrorCode;

  }

  return null;
}
