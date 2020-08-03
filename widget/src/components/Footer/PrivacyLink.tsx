/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as React from "react";
import {
  legalWebsiteURL,
  namespace
} from "../../utils/env";
import PrivacyLinkLogic from "./PrivacyLinkLogic";
import {combineURLPaths} from "../../utils/urlHelper";
import {LoadingBarIcon} from "../Icons/LoadingBarIcon/LoadingBarIcon";

interface Props {}
interface State {}

export default class PrivacyLink extends React.Component<Props, State> {
  private readonly privacyLinkLogic: PrivacyLinkLogic;

  constructor(props: Props) {
    super(props);
    this.privacyLinkLogic = new PrivacyLinkLogic({ namespace });
    this.privacyLinkLogic.subscribe(() => this.setState({}));
  }

  componentDidMount(): void {
    this.privacyLinkLogic.init();
  }

  fetchLegalDocument = () => {
    this.privacyLinkLogic.fetchData();
  };

  renderPolicyLink = () => {
    const mandatoryPolicy = this.privacyLinkLogic.getAllMandatoryPolicy();
    if (!mandatoryPolicy) return null;

    return (
      <>
        {mandatoryPolicy.map((policy) => (
          <a href={combineURLPaths(legalWebsiteURL, policy.localizedPolicyVersionId)} >{policy.policyName}</a>
        ))}
      </>
    )
  };

  render() {
    const { fetchPoliciesError } = this.privacyLinkLogic.state;
    const isLoading = this.privacyLinkLogic.isLoading();
    if (isLoading) return (<div><LoadingBarIcon className={"ab-wpr-footer-policy-loading"} /></div>);
    if (!isLoading && !!fetchPoliciesError) return (<span>Cannot load legal information <a href={"javascript:void(0)"} onClick={this.fetchLegalDocument}>Try Again</a></span>);
    return this.renderPolicyLink();
  }
}



