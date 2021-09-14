/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { Container } from "unstated";
import { isAxiosError } from "../errorDeducer";
import networkManager from "../network";
import { ElligibleUser, User } from "../user/models/user";
import { fetchCurrentUser, loginWithAuthorizationCode, logout, refreshSession } from "../user/user";
import { UserSessionError } from "./userSessionApiConstants";
import { combineURLPaths } from "../../utils/urlHelper";
import { clientId, namespace, playerPortalUrl } from "../../utils/env";
import { DEVICE_ID_KEY, generateDeviceId, getDeviceType } from "../../utils/device";
import { sleepAsync } from "../../utils/executionHelper";
import { AuthorizationCodeExchangeState } from "../../components/Auth/AuthorizationCodeExchangeStateHelper";
import LegalLogic from "../agreement/legalLogic";
const platform = require("platform");

interface UserSessionManagerConfig {
  apiUrl: string;
  clientId: string;
  redirectURI: string;
}

interface State {
  legalLogic?: LegalLogic;
  user?: User | null;
  error?: UserSessionError;
  isFetching: boolean;
  isLoggingOut: boolean;
}

const accountPage = "account/overview";
const privacyRecordPage = "account/privacy-records";

const REFRESH_EXPIRY = 1000;
const REFRESH_EXPIRY_UPDATE_RATE = 500;
const REFRESH_EXPIRY_CHECK_RATE = 1000;

const RefreshSessionLock = {
  key: "RefreshSession.lock",
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

export default class UserSessionApi extends Container<State> {
  config: UserSessionManagerConfig;
  refreshSessionLock: typeof RefreshSessionLock;

  constructor(configInput: UserSessionManagerConfig) {
    super();

    this.state = {
      legalLogic: undefined,
      isFetching: false,
      isLoggingOut: false,
      user: undefined,
      error: undefined,
    };

    this.config = configInput;
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
    const { legalLogic } = this.state;
    if (!!legalLogic) {
      const { eligibilities } = legalLogic.state;
      return !!eligibilities && eligibilities.length > 0;
    }
    return false;
  }

  currentUserNeedAdministration(): boolean {
    const { user } = this.state;
    if (!user) return false;
    return (
      this.currentUserIsUnderDeletionStatus() ||
      this.currentUserIsBlockedByLegal() ||
      this.currentUserIsHeadlessAccount() ||
      this.currentUserEmailNeedsVerification()
    );
  }

  async fetchCurrentUser(statePayload?: AuthorizationCodeExchangeState) {
    try {
      const legalLogic = new LegalLogic({ namespace });
      this.setState({ isFetching: true });
      const network = networkManager.withSessionIdFromCookie();
      const user = await fetchCurrentUser(network).then(async (result) => {
        if (result.error) throw result.error;

        await legalLogic.init();
        return result.response.data;
      });
      await this.setState({ user, error: undefined });

      if (this.currentUserEmailNeedsVerification()) return this.goToVerifyEmail(statePayload);
      if (this.currentUserIsHeadlessAccount()) return this.goToUpgradeAccount(statePayload);
      if (this.currentUserIsBlockedByLegal()) return this.goToAcceptLegal(statePayload);
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

  async loginWithAuthorizationCode({
    code,
    codeVerifier,
    statePayload,
  }: {
    code: string;
    codeVerifier: string;
    statePayload?: AuthorizationCodeExchangeState;
  }) {
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

    await this.fetchCurrentUser(statePayload);
  }

  async logout(doApiCall = true) {
    if (this.state.isLoggingOut) return;
    await this.setState({ isLoggingOut: true });
    try {
      if (doApiCall) {
        const network = networkManager.withSessionIdFromCookie({
          headers: {
            "Content-Type": "text/plain",
          },
        });
        await logout(network);
        this.setState({
          legalLogic: new LegalLogic({ namespace }),
          error: undefined,
        });
      }
    } finally {
      this.setState({ user: null, isLoggingOut: false, error: undefined });
    }
  }

  goToVerifyEmail = (statePayload?: AuthorizationCodeExchangeState): void => {
    const verifyEmailURL = new URL(combineURLPaths(playerPortalUrl, accountPage));
    if (!!statePayload && !!statePayload.path) {
      verifyEmailURL.searchParams.append("path", statePayload.path);
    }
    window.location.replace(verifyEmailURL.toString());
  };

  goToUpgradeAccount = (statePayload?: AuthorizationCodeExchangeState): void => {
    const upgradeAccountUrl = new URL(combineURLPaths(playerPortalUrl, accountPage));
    if (!!statePayload && !!statePayload.path) {
      upgradeAccountUrl.searchParams.append("path", statePayload.path);
    }
    window.location.replace(upgradeAccountUrl.toString());
  };

  goToAcceptLegal = (statePayload?: AuthorizationCodeExchangeState): void => {
    const acceptLegalURL = new URL(combineURLPaths(playerPortalUrl, privacyRecordPage));
    if (!!statePayload && !!statePayload.path) {
      acceptLegalURL.searchParams.append("path", statePayload.path);
    }
    window.location.replace(acceptLegalURL.toString());
  };

  goToDeletion = (): void => {
    const deletionURL = combineURLPaths(playerPortalUrl, accountPage);
    window.location.replace(deletionURL);
  };

  refreshSessionWithLockOrLogout = async () => {
    if (this.refreshSessionLock.isLocked()) {
      return Promise.resolve().then(async () => {
        // This block is executed when other tab / request is refreshing
        while (this.refreshSessionLock.isLocked()) {
          await sleepAsync(REFRESH_EXPIRY_CHECK_RATE);
        }

        return {};
      });
    }

    this.refreshSessionLock.lock(REFRESH_EXPIRY);
    let isLocallyRefreshingToken = true;
    // Create interval for updating refresh process expiration
    (async () => {
      while (isLocallyRefreshingToken) {
        this.refreshSessionLock.lock(REFRESH_EXPIRY);
        await sleepAsync(REFRESH_EXPIRY_UPDATE_RATE);
      }
    })();

    return Promise.resolve()
      .then(async () => {
        const network = networkManager.withSessionIdFromCookie({
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${new Buffer(`${clientId}:`).toString("base64")}`,
          },
        });

        const result = await refreshSession(network, { clientId, refreshToken: null });

        // Reject the promise if refresh session is failing
        if (result.error) {
          return false;
        }

        const { refresh_token, access_token, expires_in, is_comply, refresh_expires_in } = result.response.data;
        return {
          sessionId: access_token,
          refreshId: refresh_token,
          expiresIn: expires_in,
          refreshExpiresAt: refresh_expires_in,
          isComply: is_comply,
        };
      })
      .finally(async () => {
        await this.logout(false);
        isLocallyRefreshingToken = false;
        RefreshSessionLock.unlock();
      });
  };
}
