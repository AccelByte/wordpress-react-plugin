/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved.
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

var webpack = require('webpack');

module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = [];
  }
  config.plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          "NODE_ENV": JSON.stringify(process.env.NODE_ENV),
          "APP_SECURITY_CLIENT_ID": JSON.stringify(process.env.APP_SECURITY_CLIENT_ID),
          "JUSTICE_PUBLISHER_NAMESPACE": JSON.stringify(process.env.JUSTICE_PUBLISHER_NAMESPACE),
          "JUSTICE_BASE_URL": JSON.stringify(process.env.JUSTICE_BASE_URL),
          "CLIENT_REDIRECT_URI": JSON.stringify(process.env.CLIENT_REDIRECT_URI),
          "JUSTICE_PLAYERPORTAL_URL": JSON.stringify(process.env.JUSTICE_PLAYERPORTAL_URL),
          "JUSTICE_LEGAL_WEBSITE_URL": JSON.stringify(process.env.JUSTICE_LEGAL_WEBSITE_URL),
          "JUSTICE_CREATE_ORDER_URL": JSON.stringify(process.env.JUSTICE_CREATE_ORDER_URL),
          "CLIENT_REGISTER_URI_PATH_NAME": JSON.stringify(process.env.CLIENT_REGISTER_URI_PATH_NAME),
          "CLIENT_LOGIN_URI_PATH_NAME": JSON.stringify(process.env.CLIENT_LOGIN_URI_PATH_NAME),
        }
      })
  );
  return config;
};
