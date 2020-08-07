/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved.
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as React from "react";
import {Subscribe} from "unstated";
import classNames from "classnames";
import {AppState} from "../../app-state/createAppState";
import UserIcon from "src/components/Icons/UserIcon";
import LockIcon from "src/components/Icons/LockIcon";
import LogoutIcon from "src/components/Icons/LogoutIcon";
import {combineURLPaths} from "../../utils/urlHelper";
import {playerPortalUrl} from "../../utils/env";

const accountPath = "account";
const changePasswordPath = "account/change-password";

interface Props {
  appState: AppState;
  className?: string;
}
interface State {}

class UserProfileDropDown extends React.Component<Props, State> {
  render() {
    const { appState, className } = this.props;
    const { state: { userSession } } = appState;

    if (!userSession.state.user) return null;

    return (
      <div className={classNames("ab-wpr-user-profile-dropdown-menu", "ab-wpr-dropdown-menu", className)}>
        <div className={classNames(
          "ab-wpr-dropdown-wrapper ",
        )}>
          <ul>
            <li>
              <a href={combineURLPaths(playerPortalUrl, accountPath)}>
                <UserIcon />
                My Account
              </a>
            </li>
            <li>
              <a href={combineURLPaths(playerPortalUrl, changePasswordPath)}>
                <LockIcon />
                Change Password
              </a>
            </li>
            <li className={"ab-wpr-has-separator ab-wpr-logout"}>
              <a onClick={() => {
                userSession.logout();
              }}>
                <LogoutIcon />
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default ({ className }: { className?: string })=> (
  <Subscribe to={[AppState]}>{(appState: AppState) => <UserProfileDropDown appState={appState} className={className}/>}</Subscribe>
);
