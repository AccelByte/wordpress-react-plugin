/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved.
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as React from "react";
import {AppState} from "../../app-state/createAppState";
import {Subscribe} from "unstated";
import classNames from "classnames";
import {LoadingBarIcon} from "../Icons/LoadingBarIcon/LoadingBarIcon";
import UserProfileDropDown from "./UserProfileDropDown";
import {UserProfileLogic} from "./UserProfileLogic";
import Avatar from "../_common/Avatar";
import {breakPoint} from "../../utils/displayBreakPoint";
import {ElligibleUser} from "../../api/user/models/user";

interface Props {
  appState: AppState;
  screenWidth: number;
  isPageScrollOnTop?: boolean;
}

interface State {}

class UserProfileButton extends React.Component<Props, State> {
  userProfileLogic: UserProfileLogic;

  constructor(props: Props) {
    super(props);
    this.userProfileLogic = new UserProfileLogic();
    this.userProfileLogic.subscribe(() => this.setState({}));
  }

  componentDidMount(): void {
    this.userProfileLogic.init();
  }

  render() {
    const { appState, isPageScrollOnTop, screenWidth } = this.props;
    const { user, isFetching: isFetchingUser, error } = appState.state.userSession.state;
    const { profile, isFetching: isFetchingProfile } = this.userProfileLogic.state;
    if (isFetchingUser) {
      return (<div className={"ab-wpr-user-profile-button"}>
        <LoadingBarIcon/>
      </div>);
    }

    if (!user || error) {
      return (
        <div className={"ab-wpr-user-profile-button"}>
          <button
            onClick={() => {
              appState.state.userSession.fetchCurrentUser();
            }}
            className={classNames(
              "nectar-button",
              "medium regular",
              "accent-color",
              "regular-button",
              "ab-wpr-login-button"
            )}
          >
            Failed Fetching profile, Try again  {/* TODO: NEED TO CONSULT WITH DESIGN TEAM */}
          </button>
        </div>
      );
    }

    if (!ElligibleUser.is(user)) return null;

    return (
      <div
        className={classNames(
          "ab-wpr-user-profile-button",
          { "scrolled": !isPageScrollOnTop }
        )}
        onMouseEnter={() => this.setState({ showDropdown: true })}
        onMouseLeave={() => this.setState({ showDropdown: false })}
      >
        <Avatar
          isLoading={isFetchingProfile}
          imageUrl={profile ? profile.avatarUrl : ""}
          className={classNames(
            "ab-wpr-avatar",
            {"large": screenWidth >= breakPoint.medium.max},
            {"scrolled": !isPageScrollOnTop}
          )}
        />
        {screenWidth >= breakPoint.large.min && (
          <div
            className={classNames(
              "ab-wpr-display-name",
              {"scrolled": !isPageScrollOnTop}
            )}
            onClick={this.userProfileLogic.fetchProfile}
          >
            {user.displayName}
          </div>
        )}
        <UserProfileDropDown
          className={classNames(
            { "scrolled": !isPageScrollOnTop },
            { "large": screenWidth >= breakPoint.large.min}
          )}
        />
      </div>
    )
  }
}

export default ({ screenWidth, isPageScrollOnTop }: { screenWidth: number, isPageScrollOnTop?: boolean })=> (
  <Subscribe to={[AppState]}>{
    (appState: AppState) => (
      <UserProfileButton
        appState={appState}
        isPageScrollOnTop={isPageScrollOnTop}
        screenWidth={screenWidth}
      />
    )
  }</Subscribe>
);
