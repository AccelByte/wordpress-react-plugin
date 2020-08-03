/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {userEvent} from "src/app-messages/events/userEvent";
import {AppState} from "../app-state/createAppState";

let initialFetchDone = false;
export default async (appState: AppState) => {
  const userSession = appState.state.userSession;

  if (initialFetchDone) return;
  initialFetchDone = true;
  await userSession.fetchCurrentUser();

  userEvent.subscribe("refresh", () => userSession.fetchCurrentUser());
};
