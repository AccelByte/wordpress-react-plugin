/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { BaseAppEvent } from "./base";

type UserEventTypes = {
  logout: void;
  refresh: void;
  notifySessionExpired: void;
  verified: void;
};

class UserEvent extends BaseAppEvent<UserEventTypes> {
  logout() {
    this.emit("logout", undefined);
  }

  refresh() {
    this.emit("refresh", undefined);
  }
}

export const userEvent = new UserEvent();
