/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import axios, { AxiosError } from "axios";
import {addGlobalRequestInterceptors, addGlobalResponseInterceptors} from "src/api/network";
import {apiUrl} from "src/utils/env";
import { AppState } from "../app-state/createAppState";
import {sleepAsync} from "../utils/executionHelper";
import {authTokenExchangeUrl, logoutUrl, refreshSessionUrl} from "../api/user/user";

export default async (appState: AppState) => {
  addGlobalRequestInterceptors(
    async (config) => {
      const { userSession } = appState.state;
      if (userSession.state.user && config.url !== refreshSessionUrl) {
        while (userSession.refreshSessionLock.isLocked()) {
          await sleepAsync(200);
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  addGlobalResponseInterceptors(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const { userSession } = appState.state;
      const { refreshId } = userSession.tokenStore.get();
      if (error.response) {
        const { response } = error;
        if (
          !!refreshId &&
          response &&
          response.config &&
          response.status === 401 &&
          (response.config as any).url.includes(apiUrl) &&
          response.config.withCredentials
        ) {
          const isLogoutUrl = response.config.url === logoutUrl;
          const isRefreshUrl = response.config.url === refreshSessionUrl;
          const isGenerateAccessTokenUrl = response.config.url === authTokenExchangeUrl;

          if (isLogoutUrl || isRefreshUrl || isGenerateAccessTokenUrl) throw error;

          // other session checking will be done here
          // once the 401's already returns error code
          return await userSession.refreshSessionWithLockOrLogout().then(() => axios(error.config)).catch(() => {
            window.location.href = "/";
            throw error;
          });
        }
      }
      throw error;
    }
  );

  return;
};
