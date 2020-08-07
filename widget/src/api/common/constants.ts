/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { Enum } from "../types";

export const AppType = Enum("GAME", "SOFTWARE", "DLC", "DEMO");
export const ItemStatus = Enum("ACTIVE", "INACTIVE");
export const ItemType = Enum("APP", "COINS", "INGAMEITEM", "CODE", "BUNDLE");

export const EntitlementType = Enum("DURABLE", "CONSUMABLE");
export const EntitlementClazz = Enum("APP", "ENTITLEMENT", "DISTRIBUTION", "CODE");
export const EntitlementStatus = Enum("ACTIVE", "INACTIVE", "DISTRIBUTED", "REVOKED", "DELETED");

export const CurrencyType = Enum("REAL", "VIRTUAL");

