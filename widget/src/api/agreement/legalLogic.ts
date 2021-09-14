/*
 * Copyright (c) 2019. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { BaseAppEvent } from "../../app-messages/events/base";
import BaseLogic from "../../utils/BaseLogic";
import networkManager from "../network";
import { fetchLegalEligibilities } from "./legal";
import {
  LegalEligibilities,
  LegalEligibility,
  LocalizedPolicyVersion,
  PolicyVersionWithLocalizedVersion,
} from "./model/legal";
import { LegalPolicyType } from "./model/policies";

interface Props {
  namespace: string;
}

export interface LegalState {
  isFetching: boolean;
  eligibilities: LegalEligibilities | null;
  error: Error | null;
}

type EventTypes = {
  acceptSuccess: void;
  fetchError: Error;
  acceptError: Error;
  requestPoliciesByCountryError: Error;
};

class LegalLogicEvent extends BaseAppEvent<EventTypes> {
  fetchError(error: Error) {
    this.emit("fetchError", error);
  }
}

export default class LegalLogic extends BaseLogic<LegalState> {
  private readonly props: Props;
  event: LegalLogicEvent = new LegalLogicEvent();

  constructor(props: Props) {
    super();
    this.props = props;
    this.state = {
      isFetching: false,
      eligibilities: null,
      error: null,
    };
  }

  async init() {
    await this.fetchUnsignedPolicies();
  }

  async fetchUnsignedPolicies(): Promise<void> {
    try {
      if (this.state.isFetching) return;
      this.setState({
        isFetching: true,
        eligibilities: null,
        error: null,
      });

      const network = networkManager.withSessionIdFromCookie();
      if (!network) return;

      const result = await fetchLegalEligibilities(network, this.props.namespace);
      if (result.error) throw result.error;

      if (!result.response.data.length) return;

      // filter and map policies to have one localized policy for each policy
      const eligibilities: LegalEligibilities = result.response.data
        .filter(
          (legalEligibility: LegalEligibility) =>
            !legalEligibility.isAccepted &&
            legalEligibility.isMandatory &&
            legalEligibility.policyType === LegalPolicyType.LEGAL_DOCUMENT
        )
        .map((legalEligibility: LegalEligibility) => {
          legalEligibility.policyVersions =
            legalEligibility.policyVersions &&
            legalEligibility.policyVersions
              .slice(0, 1) // last version
              .map((policyVersion: PolicyVersionWithLocalizedVersion) => {
                policyVersion.localizedPolicyVersions =
                  policyVersion.localizedPolicyVersions &&
                  policyVersion.localizedPolicyVersions.filter(
                    (localizedPolicyVersion: LocalizedPolicyVersion) => localizedPolicyVersion.isDefaultSelection
                  );
                return policyVersion;
              })
              .filter(
                (policyVersion: PolicyVersionWithLocalizedVersion) =>
                  policyVersion.localizedPolicyVersions && policyVersion.localizedPolicyVersions.length > 0
              );
          return legalEligibility;
        })
        .filter(
          (legalEligibility: LegalEligibility) =>
            legalEligibility.policyVersions && legalEligibility.policyVersions.length > 0
        );

      if (eligibilities.length === 0) throw new Error();

      this.setState({ eligibilities });
    } catch (error) {
      this.setState({ error });
      this.event.fetchError(error);
    } finally {
      this.setState({ isFetching: false });
    }
  }
}
