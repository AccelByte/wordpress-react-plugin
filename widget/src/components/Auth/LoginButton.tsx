/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import React from 'react';
import classNames from "classnames";
import {LoadingBarIcon} from "../Icons/LoadingBarIcon/LoadingBarIcon";
import {Subscribe} from "unstated";
import {AppState} from "../../app-state/createAppState";
import UserProfileButton from "./UserProfileButton";
import {loginAPI} from "../../app-state/loginAPIInstance";
import { forgotPasswordUriPathName, loginUriPathName, registerUriPathName, clientOverlayUriPathAutoRedirect, playerPortalUrl } from 'src/utils/env';
import { targetAuthPage } from 'src/api/user-session/login';

interface Props {
  appState: AppState;
  isMobile?: boolean;
}

interface State {
  isPageScrollOnTop: boolean;
  screenWidth: number;
  isRedirectingToAuthorizeUrl: boolean;
}

class LoginButton extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      isPageScrollOnTop: true,
      screenWidth: window.innerWidth,
      isRedirectingToAuthorizeUrl: false,
    }
  }

  reportScrollPosition = () => {
    if (document.scrollingElement) {
      this.setState({
        isPageScrollOnTop: document.scrollingElement.scrollTop === 0
      });
    }
  };

  reportScreenWidth = () => {
    this.setState({screenWidth: window.innerWidth});
  };

  async componentDidMount() {
    this.reportScrollPosition();
    this.reportScreenWidth();
    window.addEventListener("resize", this.reportScreenWidth, {passive: true});
    window.addEventListener("scroll", this.reportScrollPosition, {passive: true});
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.reportScreenWidth);
    window.removeEventListener("scroll", this.reportScrollPosition);
  }

  goToWebsiteUrl = ( args: {payload: {path?: string}, targetAuthPage?: targetAuthPage} ) => {
    const {state: {userSession, initialized}} = this.props.appState;

    if (!!userSession.state.user && clientOverlayUriPathAutoRedirect) {
      window.location.replace(`${playerPortalUrl}`);
      return;
    }
    
    if (!initialized || !!userSession.state.user) return;

    if (this.state.isRedirectingToAuthorizeUrl) return;
    this.setState({isRedirectingToAuthorizeUrl: true});

    const url = loginAPI.createLoginWebsiteUrl( args );
    window.location.replace(url);
  }

  goToLogin = () => {
    const {state: {appHistory}} = this.props.appState;
    this.goToWebsiteUrl({
      payload: { path: loginUriPathName ? "/" : appHistory.location.pathname }
    });
  };

  render() {
    const {appState, isMobile} = this.props;
    const {isPageScrollOnTop, screenWidth, isRedirectingToAuthorizeUrl} = this.state;
    const {state: {userSession, initialized}} = appState;

    const isLoggedIn = !!userSession.state.user;
    const isFetchingUser = userSession.state.isFetching;
    const isLoggingOut = userSession.state.isLoggingOut;

    if( registerUriPathName && window.location.pathname === registerUriPathName ) {
      this.goToWebsiteUrl({
        payload: { path: "/" },
        targetAuthPage: targetAuthPage.register,
      });
    }

    if( loginUriPathName && window.location.pathname === loginUriPathName ) {
      this.goToLogin();
    }

    if( forgotPasswordUriPathName && window.location.pathname === forgotPasswordUriPathName ) {
      this.goToWebsiteUrl({
        payload: { path: "/" },
        targetAuthPage: targetAuthPage.forgotPassword,
      });
    }

    if (isMobile && isLoggedIn) return null;

    return (
      <>
        {!isMobile && (
          <span className={classNames(
            "ab-wpr-vertical-line-separator",
            {"scrolled": !isPageScrollOnTop}
          )}/>
        )}
        <div className="ab-wpr-login-button-container">
          {(!initialized || isRedirectingToAuthorizeUrl || (!isLoggedIn && isFetchingUser) || isLoggingOut) && (
            <LoadingBarIcon className={classNames(
              "ab-wpr-loading-indicator",
              {"scrolled": !isPageScrollOnTop}
            )}/>
          )}
          {initialized && isLoggedIn && !isFetchingUser && !isLoggingOut && !isRedirectingToAuthorizeUrl && (
            <UserProfileButton isPageScrollOnTop={isPageScrollOnTop} screenWidth={screenWidth}/>
          )}
          {initialized && !isLoggedIn && !isFetchingUser && !isLoggingOut && !isRedirectingToAuthorizeUrl && (<>
            <button
              onClick={this.goToLogin}
              className={classNames(
                "nectar-button",
                "medium regular",
                "accent-color",
                "regular-button",
                "ab-wpr-login-button",
                {"disabled": !initialized},
                {"scrolled": !isPageScrollOnTop}
              )}
            >
              Log in
            </button>

          </>)}
        </div>
      </>
    )
  }
}

export default ({isMobile}: Partial<Props>) => (
  <Subscribe to={[AppState]}>
    {(appState: AppState) => (
      <LoginButton appState={appState} isMobile={isMobile}/>
    )}
  </Subscribe>
);
