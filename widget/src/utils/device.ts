/*
 *
 *  * Copyright (c) 2020 AccelByte Inc. All Rights Reserved.
 *  * This is licensed software from AccelByte Inc, for limitations
 *  * and restrictions contact your company contract manager.
 *
 */

import {isMobile} from "is-mobile";
import {generateUUID} from "./common";

export const DEVICE_ID_KEY = "deviceId";

export const DeviceType = {
  mobile: "mobile",
  desktop: "desktop",
};

export const getDeviceType = () => {
  return isMobile() ? DeviceType.mobile : DeviceType.desktop;
};

export const generateDeviceId = () => {
  const deviceIdInUUID = generateUUID();
  localStorage.setItem(DEVICE_ID_KEY, deviceIdInUUID);
  return deviceIdInUUID;
};
