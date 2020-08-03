/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { Enum } from "../types";

export const UserSessionError = Enum("network", "server", "unknown");
export type UserSessionError = Enum<typeof UserSessionError>;
