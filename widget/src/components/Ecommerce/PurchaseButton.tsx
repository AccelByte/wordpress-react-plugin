/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as React from "react";
import classNames from "classnames";
import {ButtonStyle, PurchaseButtonLogic} from "./PurchaseButtonLogic";
import {Subscribe} from "unstated";
import {AppState} from "../../app-state/createAppState";
import {User} from "../../api/user/models/user";
import {LoadingBarIcon} from "../Icons/LoadingBarIcon/LoadingBarIcon";
import {
  PrimaryButton as PrimaryButtonLarge,
  ErrorButton as ErrorButtonLarge,
  NotAvailableButton as NotAvailableButtonLarge,
  OwnedItem as OwnedItemLarge
} from "./components/LargeButton";
import {
  PrimaryButton as PrimaryButtonDefault,
  ErrorButton as ErrorButtonDefault,
  NotAvailableButton as NotAvailableButtonDefault,
  OwnedItem as OwnedItemDefault
} from "./components/DefaultButton";
import {CurrencyApi} from "../../api/ecommerce/currencyApi";
import WithPropsGuard from "../utils/WithPropsGuard";

interface ContainerProps {
  buttonStyle: string | null;
  itemId: string;
}

interface Props extends ContainerProps {
  user?: User | null;
  currency: CurrencyApi;
}

interface State {
}

class PurchaseButton extends React.Component<Props, State> {
  readonly logic: PurchaseButtonLogic;

  constructor(props: Props) {
    super(props);
    this.logic = new PurchaseButtonLogic({ user: props.user, itemId: props.itemId });
    this.logic.subscribe(() => this.setState({}));
    this.props.currency.subscribe(() => this.setState({}));
  }

  componentDidMount(): void {
    this.logic.init();
  }

  renderPurchaseButton = () => {
    const {buttonStyle, currency: {state: {currencies}}} = this.props;
    const {item} = this.logic.state;
    if (!item) return null;
    switch (buttonStyle) {
      case ButtonStyle.Large:
        return (<PrimaryButtonLarge currencies={currencies} item={item}/>);
      default:
        return (<PrimaryButtonDefault currencies={currencies} item={item}/>);
    }
  };

  renderButton = () => {
    const { buttonStyle } = this.props;
    const { item } = this.logic.state;
    if (!item) return null;

    if (!this.logic.isItemPurchaseAble()) {
      if (this.logic.isItemOwned()) {
        switch (buttonStyle) {
          case ButtonStyle.Large:
            return <OwnedItemLarge item={item} />;
          default:
            return <OwnedItemDefault/>;
        }
      }

      switch (buttonStyle) {
        case ButtonStyle.Large:
          return <NotAvailableButtonLarge item={item} />;
        default:
          return <NotAvailableButtonDefault/>;
      }
    }

    return this.renderPurchaseButton();
  };

  errorAction = () => {
    const {currency} = this.props;
    if (currency.state.error) currency.fetchCurrency();
    if (this.logic.state.fetchEntitlementError) this.logic.fetchEntitlement();
    if (this.logic.state.fetchItemError) this.logic.fetchItem();
  };

  renderError = () => {
    const {buttonStyle} = this.props;
    switch (buttonStyle) {
      case ButtonStyle.Large:
        return (<ErrorButtonLarge onRetry={this.errorAction}/>);
      default:
        return (<ErrorButtonDefault onRetry={this.errorAction}/>);
    }
  };

  render() {
    const {currency, buttonStyle} = this.props;
    const isError = (this.logic.isError() || !!currency.state.error);
    const isLoading = (this.logic.isLoading() || currency.state.isFetching);

    return (
      <div
        className={classNames({
          "ab-wpr-purchase-container-large": buttonStyle === ButtonStyle.Large,
          "ab-wpr-purchase-container-default": buttonStyle !== ButtonStyle.Large
        })}
      >
        {isLoading && (<LoadingBarIcon className={"ab-wpr-purchase-container-loading"}/>)}
        {!isLoading && !isError && this.renderButton()}
        {!isLoading && isError && this.renderError()}
      </div>
    )
  }
}

const PurchaseButtonWithPropsGuard = WithPropsGuard<Props>(PurchaseButton, ((prevProps, nextProps) => {
  return JSON.stringify(prevProps.user) !== JSON.stringify(nextProps.user);
}));

export default ({buttonStyle, itemId}: ContainerProps) => (
  <Subscribe to={[AppState]}>
    {(appState: AppState) => (
      <PurchaseButtonWithPropsGuard
        user={appState.state.userSession.state.user}
        currency={appState.state.currency}
        itemId={itemId}
        buttonStyle={buttonStyle}
      />
    )}
  </Subscribe>
);
