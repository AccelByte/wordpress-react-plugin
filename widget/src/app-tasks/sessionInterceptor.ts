/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import axios, { AxiosError } from "axios";
import { addGlobalRequestInterceptors, addGlobalResponseInterceptors } from "src/api/network";
import { apiUrl, playerPortalUrl } from "src/utils/env";
import { AppState } from "../app-state/createAppState";
import { sleepAsync } from "../utils/executionHelper";
import { authTokenExchangeUrl, logoutUrl, refreshSessionUrl } from "../api/user/user";

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
      if (error.response) {
        const { response } = error;
        if (
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

          const paths = window.location.pathname.split("/"); // SA-647 register with steam use headless account

          // other session checking will be done here
          // once the 401's already returns error code
          return await userSession.refreshSessionWithLockOrLogout().then((tokenStore) => {
            if (tokenStore) {
              return axios(error.config);
            }

            if (!!userSession.state.user) {
              window.location.href = "/";
            }

            // SA-647 register with steam use headless account: start
            if (paths.includes("link-account") && window.location.search !== "") {
              window.location.href = `${playerPortalUrl}link-account${window.location.search}`;
            }
            // SA-647 register with steam use headless account: end

            throw error;
          });
        }
      }
      throw error;
    }
  );

  return;
};
