/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";

export const Paging = ioTs.partial({
  previous: ioTs.string,
  next: ioTs.string,
});
export type Paging = ioTs.TypeOf<typeof Paging>;
