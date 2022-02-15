/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

// Do not add import here: adding and import will break the compiler's publicPath

export const isDevMode = process.env.NODE_ENV === "development";

export const redirectURI = process.env.CLIENT_REDIRECT_URI || (isDevMode && "https://demo.accelbyte.io") || "";

export const clientId = process.env.APP_SECURITY_CLIENT_ID || "";

export const namespace = process.env.JUSTICE_PUBLISHER_NAMESPACE || "";

export const apiUrl = process.env.JUSTICE_BASE_URL || (isDevMode && "https://demo.accelbyte.io") || "";

export const playerPortalUrl =
  process.env.JUSTICE_PLAYERPORTAL_URL || (isDevMode && "https://demo.accelbyte.io/player") || "";

export const legalWebsiteURL =
  process.env.JUSTICE_LEGAL_WEBSITE_URL || (isDevMode && "https://demo.accelbyte.io/legal") || "";

export const createOrderUrl =
  process.env.JUSTICE_CREATE_ORDER_URL || (isDevMode && "https://demo.accelbyte.io/player/create-order") || "";

export const registerUriPathName = process.env.CLIENT_REGISTER_URI_PATH_NAME || "";

export const loginUriPathName = process.env.CLIENT_LOGIN_URI_PATH_NAME || "";

export const forgotPasswordUriPathName = process.env.CLIENT_FORGOT_PASSWORD_URI_PATH_NAME || "";

export const clientOverlayUriPathAutoRedirect = !process.env.CLIENT_OVERLAY_URI_PATH_AUTO_REDIRECT || process.env.CLIENT_OVERLAY_URI_PATH_AUTO_REDIRECT === "true" || false;
