/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved.
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as ioTs from "io-ts";
import {Enum} from "../../types";

export const LegalPolicyType = {
  LEGAL_DOCUMENT: "Legal Document",
  MARKETING_PREFERENCE: "Marketing Preference",
};

export const PolicyTypeEnum = Enum("LEGAL_DOCUMENT_TYPE", "MARKETING_PREFERENCE_TYPE");

export const TagsEnum = Enum("FOOTER");

export const LocalizedPolicy = ioTs.intersection([
  ioTs.type({
    id: ioTs.string,
    localeCode: ioTs.string,
    isDefaultSelection: ioTs.boolean,
  }),
  ioTs.partial({
    createdAt: ioTs.string,
    updatedAt: ioTs.string,
    contentType: ioTs.string,
    attachmentLocation: ioTs.string,
    attachmentChecksum: ioTs.string,
    attachmentVersionIdentifier: ioTs.string,
    description: ioTs.string,
    status: ioTs.string,
    publishedDate: ioTs.string,
  })
]);
export type LocalizedPolicy = ioTs.TypeOf<typeof LocalizedPolicy>;

export const PolicyVersion = ioTs.intersection([
  ioTs.type({
    id: ioTs.string,
    displayVersion: ioTs.string,
    isCommitted: ioTs.boolean,
    isInEffect: ioTs.boolean,
  }),
  ioTs.partial({
    createdAt: ioTs.string,
    updatedAt: ioTs.string,
    description: ioTs.string,
    status: ioTs.string,
    publishedDate: ioTs.string,
    localizedPolicyVersions: ioTs.array(LocalizedPolicy),
  })
]);
export type PolicyVersion = ioTs.TypeOf<typeof PolicyVersion>;


export const Policy = ioTs.intersection([
  ioTs.type({
    id: ioTs.string,
    policyName: ioTs.string,
    policyType: ioTs.string,
    namespace: ioTs.string,
    countryCode: ioTs.string,
    shouldNotifyOnUpdate: ioTs.boolean,
    isMandatory: ioTs.boolean,
    isDefaultOpted: ioTs.boolean,
    isDefaultSelection: ioTs.boolean,
  }),
  ioTs.partial({
    createdAt: ioTs.string,
    updatedAt: ioTs.string,
    readableId: ioTs.string,
    countryGroupCode: ioTs.string,
    baseUrls: ioTs.array(ioTs.string),
    policyVersions: ioTs.array(PolicyVersion),
    description: ioTs.string,
  })
]);
export type Policy = ioTs.TypeOf<typeof Policy>;

export const PolicyResponse = ioTs.array(Policy);
export type PolicyResponse = ioTs.TypeOf<typeof PolicyResponse>;


export class PolicyResponseDecodeError extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, PolicyResponseDecodeError.prototype);
  }
}
