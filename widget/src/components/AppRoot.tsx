/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import React from 'react';
import {Subscribe} from "unstated";
import {AppState} from "../app-state/createAppState";

interface Props {
  appState: AppState;
}

interface State {
}

class AppRoot extends React.Component<Props, State> {

  async componentDidMount() {
    const {appState} = this.props;
    await Promise.all([
      await import("src/app-tasks")
        .then((module) => module.default)
        .then(async (taskRunner) => await taskRunner()),
    ]).then(() => {
      appState.markInitialFetchDone();
      if (
        !appState.state.userSession.state.user ||
        (!!appState.state.userSession.state.user && !appState.state.userSession.currentUserNeedAdministration())
      ) {
        this.hideLoadingIndicator();
      }
    });
  }

  currentUserNeedAdministration = () => {
    const { appState: { state: { userSession } } } = this.props;
    if (!userSession.state.user) return false;
    if (userSession.currentUserEmailNeedsVerification()) return true;
    if (userSession.currentUserIsHeadlessAccount()) return true;
    if (userSession.currentUserIsBlockedByLegal()) return true;
    return userSession.currentUserIsUnderDeletionStatus();
  };

  hideLoadingIndicator = () => {
    document.getElementById("ajax-loading-screen")?.classList.remove("ab-wpr-loading-screen");
  };

  render() {
    return <div/>;
  };
}

export default () => (
  <Subscribe to={[AppState]}>
    {(appState: AppState) => (
      <AppRoot appState={appState}/>
    )}
  </Subscribe>
);
