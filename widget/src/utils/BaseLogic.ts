/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { Container } from "unstated";

export default class BaseLogic<T extends object> extends Container<T> {
  init() {}
  deinit() {}
}
