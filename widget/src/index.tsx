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
  AppRootId: document.getElementById("ab-wpr-root"),
  AuthButtonRootId: document.getElementById("ab-wpr-login-button-root"),
  AuthButtonRootMobileId: document.getElementById("ab-wpr-login-button-root-mobile"),
  FooterPrivacyLinkId: document.getElementById("ab-wpr-footer-privacy-link"),
  PurchaseButtonClassName: document.getElementById("ab-wpr-purchase-btn")
};

if (ElementSelector.AppRootId) {
  ReactDOM.render(
    <Provider inject={[appState, appState.state.userSession]}>
      <AppRoot/>
    </Provider>
    , ElementSelector.AppRootId);
} else {
  console.error("Element with id ab-wpr-root is not exist, please add element with id ab-wpr-root to make plugin work correctly");
}

if (ElementSelector.AuthButtonRootId) {
  ReactDOM.render(
    <Provider inject={[appState, appState.state.userSession]}>
      <LoginButton/>
    </Provider>
    , ElementSelector.AuthButtonRootId);
}

// Note: The HTML element for ab-wpr-footer-privacy-link is created on WordPress plugin, and should be customize able from admin dashboard
if (ElementSelector.FooterPrivacyLinkId) {
  ReactDOM.render(
    <Provider inject={[appState, appState.state.userSession]}>
      <PrivacyLink/>
    </Provider>
    , ElementSelector.FooterPrivacyLinkId);
}

// Purchase button queried by className since in a page can have more than one purchase button with different itemId
const PurchaseButtonElement = ElementSelector.PurchaseButtonClassName;
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
