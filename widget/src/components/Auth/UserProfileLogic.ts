/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved.
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {Container} from "unstated";
import {UserProfile} from "../../api/user/models/profile";
import networkManager from "../../api/network";
import { fetchUserProfile, fetchUserProfileAvatar } from "../../api/user/profile"; // SA-558 The avatar in paydaythegame.com is not the same as in my account
import { namespace } from "src/utils/env";

interface State {
  profile?: UserProfile | null;
  isFetching: boolean;
  error?: Error | null;
}

export class UserProfileLogic extends Container<State> {
  constructor() {
    super();
    this.state = {
      profile: undefined,
      isFetching: false,
      error: undefined
    }
  }

  async init() {
    await this.fetchProfile();
  }

  fetchProfile = async () => {
    if (this.state.isFetching) return;
    await this.setState({
      isFetching: true,
      error: null,
    });

    try {
      const network = networkManager.withSessionIdFromCookie();
      const profile = await fetchUserProfile(network, { namespace }).then((result) => {
        if (result.error) throw result.error;
        return result.response.data;
      });
      // SA-558 The avatar in paydaythegame.com is not the same as in my account: start
      const userAvatar = await fetchUserProfileAvatar(network, { namespace });
      if (userAvatar.error) throw userAvatar.error;
      profile.avatarUrl = userAvatar.response?.data.avatarUrl;
      // SA-558 The avatar in paydaythegame.com is not the same as in my account: end
      this.setState({ profile, error: null });
    } catch (error) {
      await this.setState({ error });
    } finally {
      await this.setState({ isFetching: false });
    }
  };
}
