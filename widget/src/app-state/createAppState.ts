/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {History} from "history";
import {Container} from "unstated";
import UserSessionApi from "../api/user-session/userSessionApi";
import userSession from "./user-session/index";
import { default as currency, CurrencyApi } from "../api/ecommerce/currencyApi";

export interface AppStateModel {
  userSession: UserSessionApi;
  currency: CurrencyApi;
  appHistory: History;
  initialized: boolean;
}

export interface AppStateConstructorArgs {
  history: History;
}

export class AppState extends Container<AppStateModel> {
  constructor({history}: AppStateConstructorArgs) {
    super();
    this.state = {
      appHistory: history,
      userSession,
      currency,
      initialized: false,
    };
    [userSession].forEach((stateManager: Container<any>) => stateManager.subscribe(() => this.setState({})));
  }

  markInitialFetchDone() {
    this.setState({ initialized: true });
  }
}

export default function (constructorArgs: AppStateConstructorArgs) {
  return new AppState(constructorArgs);
}
