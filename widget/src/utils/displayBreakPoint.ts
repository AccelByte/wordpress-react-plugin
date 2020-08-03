/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

export const breakPoint: { [key: string]: { min: number, max: number } } = {
  large: { min: 1241, max: Infinity },
  medium: { min: 1120, max: 1240 },
  small: { min: 0, max: 1119 },
};
