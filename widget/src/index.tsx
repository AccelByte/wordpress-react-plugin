/*
 Copyright (c) 2019 AccelByte Inc. All Rights Reserved.
 This is licensed software from AccelByte Inc, for limitations
 and restrictions contact your company contract manager.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "unstated";

import {appState} from "src/app-state/store";
import UNSTATED from "unstated-debug";

import AppRoot from './components/AppRoot';
import LoginButton from './components/Auth/LoginButton';
import PrivacyLink from "./components/Footer/PrivacyLink";
import PurchaseButton from "./components/Ecommerce/PurchaseButton";

const isProduction = process.env.NODE_ENV === "production";

UNSTATED.isCollapsed = false;
if (isProduction) {
  UNSTATED.logStateChanges = false;
}

export const ElementSelector = {
  AppRootId: "ab-wpr-root",
  AuthButtonRootId: "ab-wpr-login-button-root",
  AuthButtonRootMobileId: "ab-wpr-login-button-root-mobile",
  FooterPrivacyLinkId: "ab-wpr-footer-privacy-link",
  PurchaseButtonClassName: "ab-wpr-purchase-btn"
};

if (document.getElementById(ElementSelector.AppRootId)) {
  ReactDOM.render(
    <Provider inject={[appState, appState.state.userSession]}>
      <AppRoot/>
    </Provider>
    , document.getElementById(ElementSelector.AppRootId));
}

if (document.getElementById(ElementSelector.AuthButtonRootId)) {
  ReactDOM.render(
    <Provider inject={[appState, appState.state.userSession]}>
      <LoginButton/>
    </Provider>
    , document.getElementById(ElementSelector.AuthButtonRootId));
}

// Note: The HTML element for ab-wpr-footer-privacy-link is created on WordPress plugin, and should be customize able from admin dashboard
if (document.getElementById(ElementSelector.FooterPrivacyLinkId)) {
  ReactDOM.render(
    <Provider inject={[appState, appState.state.userSession]}>
      <PrivacyLink/>
    </Provider>
    , document.getElementById(ElementSelector.FooterPrivacyLinkId));
}

// Purchase button queried by className since in a page can have more than one purchase button with different itemId
const PurchaseButtonElement = document.getElementsByClassName(ElementSelector.PurchaseButtonClassName);
if (PurchaseButtonElement) {
  Array.prototype.forEach.call(PurchaseButtonElement, (element: Element) => {
    const itemId = element.getAttribute("data-item-id");
    const buttonStyle = element.getAttribute("data-btn-type");
    if (!itemId) return;
    ReactDOM.render(
      <Provider inject={[appState, appState.state.userSession]}>
        <PurchaseButton itemId={itemId} buttonStyle={buttonStyle}/>
      </Provider>, element
    )
  });
}
