/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { Container } from "unstated";
import {Policy, PolicyResponse, PolicyTypeEnum, TagsEnum} from "../../api/agreement/model/policies";
import networkManager from "../../api/network";
import {fetchGeoLocationInformation} from "../../api/misc/getLocationApi";
import {fetchPoliciesByCountryCode} from "../../api/agreement/policiesApi";

interface Props {
  namespace: string;
}

interface State {
  isFetchingGeoLocation: boolean,
  isFetchingPolicies: boolean,
  fetchPoliciesError: Error | null;
  policies: PolicyResponse | null;
}

interface DisplayedPolicy {
  policyName: string;
  policyId: string;
  policyVersionId: string;
  localizedPolicyVersionId: string;
}

export default class BasicLogic extends Container<State> {
  private readonly props: Props;

  constructor(props: Props) {
    super();
    this.props = props;
    this.state = {
      isFetchingGeoLocation: false,
      isFetchingPolicies: false,
      policies: null,
      fetchPoliciesError: null
    }
  }

  init() {
    this.fetchData();
  }

  fetchData = () => {
    this.fetchGeoLocation().then(this.fetchPoliciesByCountryCode);
  };

  fetchGeoLocation = async (): Promise<string | undefined> => {
    if (this.state.isFetchingGeoLocation) return undefined;
    this.setState({ isFetchingGeoLocation: true });
    try {
      const network = networkManager.create();
      const geoLocation = await fetchGeoLocationInformation(network).then((result) => {
        if (result.error) throw result.error;
        return result.response.data;
      });
      return geoLocation.CountryCode;
    } catch (e) {
      return undefined;
    } finally {
      this.setState({ isFetchingGeoLocation: false });
    }
  };

  isLoading() {
    const { isFetchingGeoLocation, isFetchingPolicies } = this.state;
    return isFetchingGeoLocation || isFetchingPolicies;
  }

  fetchPoliciesByCountryCode = async (countryCode = "US") => {
    const { namespace } = this.props;
    if (this.state.isFetchingPolicies) return;
    this.setState({ isFetchingPolicies: true, fetchPoliciesError: null, policies: null });
    try {
      const network = networkManager.create();
      const policies = await fetchPoliciesByCountryCode(
        network,
        {
          namespace,
          countryCode,
          defaultOnEmpty: true,
          policyType: PolicyTypeEnum.LEGAL_DOCUMENT_TYPE,
          tags: [TagsEnum.FOOTER]
        }
      ).then((result) => {
        if (result.error) throw result.error;
        return result.response.data;
      });
      this.setState({ policies, fetchPoliciesError: null });
    } catch (e) {
      this.setState({ policies: null, fetchPoliciesError: e });
    } finally {
      this.setState({ isFetchingPolicies: false });
    }
  };

  getAllMandatoryPolicy = (): DisplayedPolicy[] | void => {
    const { policies, fetchPoliciesError } = this.state;
    if (this.isLoading() || !!fetchPoliciesError || !policies) return;

    const requiredPolicies: DisplayedPolicy[] = [];
    policies.map((policy: Policy) => {
      const { id, policyName, policyVersions } = policy;
      if (!policyVersions || !policyVersions.length || !policy.isMandatory) return;

      const policyVersion = policyVersions[0];
      const policyVersionId = policyVersion.id;
      if (!policyVersion.localizedPolicyVersions || !policyVersion.localizedPolicyVersions.length) return;

      const localizedPolicy = policyVersion.localizedPolicyVersions.find(
        (localization) => localization.isDefaultSelection === true
      );

      if (!localizedPolicy) return;
      requiredPolicies.push({
        policyName,
        policyVersionId,
        policyId: id,
        localizedPolicyVersionId: localizedPolicy.id,
      });
    });
    return requiredPolicies;
  }
}
