/*
 * Copyright (c) 2020. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

export function* Keygen() {
  const max = 10;
  let key = 0;
  while (true) {
    yield String(key);
    key = (key + 1) % max;
  }
}
