/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved.
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {Container} from "unstated";
import {UserProfile} from "../../api/user/models/profile";
import networkManager from "../../api/network";
import {fetchUserProfile} from "../../api/user/profile";
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
      this.setState({ profile, error: null });
    } catch (error) {
      await this.setState({ error });
    } finally {
      await this.setState({ isFetching: false });
    }
  };
}
