/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { createBrowserHistory } from "history";
import createAppState from "./createAppState";

export const appHistory = createBrowserHistory({});
export const appState = createAppState({ history: appHistory });

