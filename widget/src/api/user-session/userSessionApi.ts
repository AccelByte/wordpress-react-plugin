/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { Container } from "unstated";
import { isAxiosError } from "../errorDeducer";
import networkManager from "../network";
import {ElligibleUser, InelligibleUser, User} from "../user/models/user";
import {fetchCurrentUser, loginWithAuthorizationCode, logout, refreshSession} from "../user/user";
import { UserSessionError } from "./userSessionApiConstants";
import {combineURLPaths} from "../../utils/urlHelper";
import {clientId, playerPortalUrl} from "../../utils/env";
import {DEVICE_ID_KEY, generateDeviceId, getDeviceType} from "../../utils/device";
import {sleepAsync} from "../../utils/executionHelper";
const platform = require("platform");

interface UserSessionManagerConfig {
  apiUrl: string;
  clientId: string;
  redirectURI: string;
}

interface State {
  user?: User | null;
  error?: UserSessionError;
  isFetching: boolean;
  isLoggingOut: boolean;
}

const accountPage = "account/overview";
const privacyRecordPage = "account/privacy-records";

const storageIdKeyPrefix = "pp:session";

const REFRESH_EXPIRY = 1000;
const REFRESH_EXPIRY_UPDATE_RATE = REFRESH_EXPIRY / 2;
const REFRESH_EXPIRY_CHECK_RATE = 1000;

const RefreshSessionLock = {
  key: `${storageIdKeyPrefix}.lock`,
  isLocked: (): boolean => {
    const lockStatus = localStorage.getItem(RefreshSessionLock.key);
    if (!lockStatus) {
      return false;
    }
    const lockExpiry = Number(lockStatus);
    if (isNaN(lockExpiry)) {
      return false;
    }
    return lockExpiry > new Date().getTime();
  },
  lock: (expiry: number) => {
    localStorage.setItem(RefreshSessionLock.key, `${new Date().getTime() + expiry}`);
  },
  unlock: () => {
    localStorage.removeItem(RefreshSessionLock.key);
  },
};

const TokenStore = {
  refreshIdkey: `${storageIdKeyPrefix}.refreshId`,
  sessionIdkey: `${storageIdKeyPrefix}.sessionId`,
  expiresInKey: `${storageIdKeyPrefix}.expiresIn`,
  set: ({ refresh_id, session_id, expires_in }: { refresh_id: string; session_id: string; expires_in: number }) => {
    localStorage.setItem(TokenStore.refreshIdkey, refresh_id);
    localStorage.setItem(TokenStore.sessionIdkey, session_id);
    localStorage.setItem(TokenStore.expiresInKey, JSON.stringify(expires_in));
  },
  get: () => {
    return {
      refreshId: localStorage.getItem(TokenStore.refreshIdkey) || null,
      sessionId: localStorage.getItem(TokenStore.sessionIdkey) || null,
      expiresIn: JSON.parse(localStorage.getItem(TokenStore.expiresInKey) || '0'),
    };
  },
  remove: () => {
    localStorage.removeItem(TokenStore.refreshIdkey);
    localStorage.removeItem(TokenStore.sessionIdkey);
    localStorage.removeItem(TokenStore.expiresInKey);
  },
};

export default class UserSessionApi extends Container<State> {
  config: UserSessionManagerConfig;
  tokenStore: typeof TokenStore;
  refreshSessionLock: typeof RefreshSessionLock;

  constructor(configInput: UserSessionManagerConfig) {
    super();

    this.state = {
      isFetching: false,
      isLoggingOut: false,
      user: undefined,
      error: undefined,
    };

    this.config = configInput;
    this.tokenStore = TokenStore;
    this.refreshSessionLock = RefreshSessionLock;
  }

  currentUserIsHeadlessAccount(): boolean {
    const { user } = this.state;
    if (!user) return false;
    return user.emailAddress === "";
  }

  currentUserEmailNeedsVerification(): boolean {
    const { user } = this.state;
    if (!user) return false;
    return ElligibleUser.is(user) && !!user.emailAddress && !user.emailVerified;
  }

  currentUserIsUnderDeletionStatus(): boolean {
    const { user } = this.state;
    if (!user) return false;
    return !!user.deletionStatus;
  }

  currentUserIsBlockedByLegal(): boolean {
    const { user } = this.state;
    if (!user) return false;
    return InelligibleUser.is(user) && !user.eligible;
  }

  currentUserNeedAdministration(): boolean {
    const { user } = this.state;
    if (!user) return false;
    return this.currentUserIsUnderDeletionStatus() ||
      this.currentUserIsBlockedByLegal() ||
      this.currentUserIsHeadlessAccount() ||
      this.currentUserEmailNeedsVerification()
  }

  async fetchCurrentUser() {
    try {
      this.setState({ isFetching: true });
      const network = networkManager.withSessionIdFromCookie();
      const user = await fetchCurrentUser(network).then((result) => {
        if (result.error) throw result.error;
        return result.response.data;
      });
      await this.setState({ user, error: undefined });

      if (this.currentUserEmailNeedsVerification()) return this.goToVerifyEmail();
      if (this.currentUserIsHeadlessAccount()) return this.goToUpgradeAccount();
      if (this.currentUserIsBlockedByLegal()) return this.goToAcceptLegal();
      if (this.currentUserIsUnderDeletionStatus()) return this.goToDeletion();
    } catch (error) {
      if (isAxiosError(error)) {
        if (!error.response) {
          this.setState({ error: UserSessionError.network });
        } else {
          const { status } = error.response;
          if (status === 401) {
            this.setState({ user: null, error: undefined });
          } else if (status >= 500) {
            this.setState({ error: UserSessionError.server });
          } else {
            this.setState({ error: UserSessionError.unknown });
          }
        }
      } else {
        await this.setState({ error: UserSessionError.unknown });
      }
    } finally {
      await this.setState({ isFetching: false });
    }
  }

  async loginWithAuthorizationCode({ code, codeVerifier }: { code: string; codeVerifier: string }) {
    const network = networkManager.withSessionIdFromCookie({
      headers: {
        "Device-Id": localStorage.getItem(DEVICE_ID_KEY) || generateDeviceId(),
        "Device-Name": platform.name.toString(),
        "Device-Os": platform.os.toString(),
        "Device-Type": getDeviceType(),
      },
    });
    const result = await loginWithAuthorizationCode(network, {
      code,
      codeVerifier,
      redirectURI: this.config.redirectURI,
      clientId: this.config.clientId,
    });
    if (result.error) throw result.error;

    const { session_id, expires_in,  refresh_id } = result.response.data;
    this.tokenStore.set({ session_id, expires_in, refresh_id });

    await this.fetchCurrentUser();
  }

  async logout(doApiCall = true) {
    if (this.state.isLoggingOut) return;
    await this.setState({ isLoggingOut: true });
    try {
      this.tokenStore.remove();
      if (doApiCall) {
        const network = networkManager.withSessionIdFromCookie();
        await logout(network);
      }
    } finally {
      this.setState({ user: null, isLoggingOut: false, error: undefined });
    }
  }

  goToVerifyEmail = (): void => {
    const verifyEmailURL = combineURLPaths(playerPortalUrl, accountPage);
    window.location.replace(verifyEmailURL);
  };

  goToUpgradeAccount = (): void => {
    const verifyEmailURL = combineURLPaths(playerPortalUrl, accountPage);
    window.location.replace(verifyEmailURL);
  };

  goToAcceptLegal = (): void => {
    const acceptLegalURL = combineURLPaths(playerPortalUrl, privacyRecordPage);
    window.location.replace(acceptLegalURL);
  };

  goToDeletion = (): void => {
    const deletionURL = combineURLPaths(playerPortalUrl, accountPage);
    window.location.replace(deletionURL);
  };

  refreshSessionWithLockOrLogout = async () => {
    if (this.refreshSessionLock.isLocked()) {
      while (this.refreshSessionLock.isLocked()) {
        await sleepAsync(REFRESH_EXPIRY_CHECK_RATE);
      }

      // Resolve the promise if the token already refreshed by previous request
      if (!!this.tokenStore.get().refreshId) {
        return Promise.resolve();
      }

      // Reject the promise if the refresh token action by previous request is failed
      await this.logout(false);
      return Promise.reject();
    }

    this.refreshSessionLock.lock(REFRESH_EXPIRY);
    let isRefreshingToken = true;
    // Create interval for updating refresh process expiration
    (async () => {
      while (isRefreshingToken && this.refreshSessionLock.isLocked()) {
        this.refreshSessionLock.lock(REFRESH_EXPIRY);
        await sleepAsync(REFRESH_EXPIRY_UPDATE_RATE);
      }
    })();

    const { refreshId } = this.tokenStore.get();
    if (!refreshId) {
      // Reject the promise if there's no refreshId in the storage
      await this.logout(false);
      this.refreshSessionLock.unlock();
      return Promise.reject();
    }

    const network = networkManager.withSessionIdFromCookie({
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const result = await refreshSession(network, { clientId, refreshId });
    // Reject the promise if refresh session is failing
    if (result.error) {
      await this.logout();
      this.refreshSessionLock.unlock();
      return Promise.reject();
    }

    const { refresh_id, session_id, expires_in } = result.response.data;
    this.tokenStore.set({ refresh_id, session_id, expires_in });
    isRefreshingToken = false;
    this.refreshSessionLock.unlock();
    return Promise.resolve();
  }

}
