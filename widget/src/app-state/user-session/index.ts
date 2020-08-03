/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import UserSessionApi from "src/api/user-session/userSessionApi";
import { apiUrl, clientId, redirectURI } from "src/utils/env";

export default new UserSessionApi({ apiUrl, clientId, redirectURI });
