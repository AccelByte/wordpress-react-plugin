/*
 * Copyright (c) 2021. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";

export const LocalizedPolicyVersion = ioTs.intersection([
  ioTs.type({
    id: ioTs.string,
  }),
  ioTs.partial({
    createdAt: ioTs.string,
    updatedAt: ioTs.string,
    localeCode: ioTs.string,
    contentType: ioTs.string,
    attachmentLocation: ioTs.string,
    attachmentChecksum: ioTs.string,
    attachmentVersionIdentifier: ioTs.string,
    description: ioTs.string,
    isDefaultSelection: ioTs.boolean,
  }),
]);
export type LocalizedPolicyVersion = ioTs.TypeOf<typeof LocalizedPolicyVersion>;

export const PolicyVersionWithLocalizedVersion = ioTs.intersection([
  ioTs.type({
    id: ioTs.string,
  }),
  ioTs.partial({
    createdAt: ioTs.string,
    updatedAt: ioTs.string,
    displayVersion: ioTs.string,
    description: ioTs.string,
    localizedPolicyVersions: ioTs.array(LocalizedPolicyVersion),
    isCommitted: ioTs.boolean,
    isCrucial: ioTs.boolean,
    isInEffect: ioTs.boolean,
  }),
]);
export type PolicyVersionWithLocalizedVersion = ioTs.TypeOf<typeof PolicyVersionWithLocalizedVersion>;

export const LegalEligibility = ioTs.intersection([
  ioTs.type({
    policyId: ioTs.string,
    policyName: ioTs.string,
    policyType: ioTs.string,
    namespace: ioTs.string,
    countryCode: ioTs.string,
    isMandatory: ioTs.boolean,
    isAccepted: ioTs.boolean,
  }),
  ioTs.partial({
    readableId: ioTs.string,
    countryGroupCode: ioTs.string,
    baseUrls: ioTs.array(ioTs.string),
    policyVersions: ioTs.array(PolicyVersionWithLocalizedVersion),
    description: ioTs.string,
  }),
]);
export type LegalEligibility = ioTs.TypeOf<typeof LegalEligibility>;
export const LegalEligibilities = ioTs.array(LegalEligibility);
export type LegalEligibilities = ioTs.TypeOf<typeof LegalEligibilities>;
export class LegalEligibilityDecodeError extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, LegalEligibilityDecodeError.prototype);
  }
}
