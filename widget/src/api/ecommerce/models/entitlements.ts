/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";
import {Paging} from "../../common/models/pagination";
import {EntitlementClazz, EntitlementStatus, EntitlementType} from "../../common/constants";
import {ItemSnapshot} from "./itemSnapshot";

export const Entitlement = ioTs.intersection([
  ioTs.type({
    id: ioTs.string,
    itemId: ioTs.string,
  }),
  ioTs.partial({
    namespace: ioTs.string,
    targetNamespace: ioTs.string,
    clazz: ioTs.keyof(EntitlementClazz),
    type: ioTs.keyof(EntitlementType),
    status: ioTs.keyof(EntitlementStatus),
    appId: ioTs.string,
    appType: ioTs.string,
    sku: ioTs.string,
    userId: ioTs.string,
    bundleItemId: ioTs.string,
    grantedCode: ioTs.string,
    itemNamespace: ioTs.string,
    name: ioTs.string,
    useCount: ioTs.number,
    quantity: ioTs.number,
    distributedQuantity: ioTs.number,
    itemSnapshot: ItemSnapshot,
  }),
]);

export type Entitlement = ioTs.TypeOf<typeof Entitlement>;

export const PlatformEntitlementList = ioTs.type({
  data: ioTs.array(Entitlement),
  paging: Paging,
});

export type PlatformEntitlementList = ioTs.TypeOf<typeof PlatformEntitlementList>;

export class EntitlementDecodeError extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, EntitlementDecodeError.prototype);
  }
}
