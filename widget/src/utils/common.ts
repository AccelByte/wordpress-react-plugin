/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

const uuidv4 = require("uuid/v4");

export async function waitForImageLoad(url: string | undefined) {
  return new Promise((resolve, reject) => {
    if (!!url) {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = (error) => reject(error);
      image.src = url;
    } else reject();
  });
}

export const generateUUID = () => {
  return uuidv4()
    .split("-")
    .join("");
};
