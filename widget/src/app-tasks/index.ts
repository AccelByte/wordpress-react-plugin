/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {AppState} from "../app-state/createAppState";
import {appState} from "../app-state/store";
import initialUserFetcher from "./initialUserFetcher";
import initSessionInterceptor from "./sessionInterceptor";
import exchangeAuthorizationCode from "./exchangeAuthorizationCode";

type Task = (appState: AppState) => any;

const tasks: Task[] = [
  initSessionInterceptor,
  initialUserFetcher,
  exchangeAuthorizationCode,
];

export default async () => await tasks.reduce(async (promise, task) => { await promise; await task(appState); }, Promise.resolve());
