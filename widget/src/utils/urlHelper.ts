/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved.
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {createOrderUrl} from "./env";

export function silentUrlBuilder(maybeAbsoluteUrl: string): URL | null {
  try {
    return new URL(maybeAbsoluteUrl);
  } catch (error) {
    return null;
  }
}

export function silentSearchParamsBuilder(usvString: string): URLSearchParams {
  try {
    return new URLSearchParams(usvString);
  } catch (error) {
    return new URLSearchParams("");
  }
}

export function trimSlashFromStringEnd(pathString: string) {
  let newString = pathString;
  while (newString[newString.length - 1] === "/") {
    newString = newString.slice(0, -1);
  }
  return newString;
}

export function trimSlashFromStringStart(pathString: string) {
  let newString = pathString;
  while (newString[0] === "/") {
    newString = newString.slice(1);
  }
  return newString;
}

export function trimSlashFromStringEdges(pathString: string) {
  return trimSlashFromStringStart(trimSlashFromStringEnd(pathString));
}

export function makeAbsolutePath(path: string) {
  return `/${trimSlashFromStringStart(path)}`;
}

export function combinePaths(...paths: string[]) {
  paths.forEach((path) => {
    if (typeof path !== "string") {
      throw new Error("combinePaths error: one of the path is not a string");
    }
  });
  return paths
    .map((path) => trimSlashFromStringEdges(path))
    .map((path) => path.split("/"))
    .reduce((path, nextPath) => path.concat(nextPath), [])
    .filter(Boolean)
    .join("/");
}

export function combineURLPaths(urlString: string, ...paths: string[]) {
  const url = new URL(urlString);
  const { origin } = url;
  const pathname = combinePaths(url.pathname, ...paths);
  return new URL(pathname, origin).toString();
}

export function getCreateOrderUrl(itemId: string, returnUrl?: string) {
  return `${trimSlashFromStringEnd(combineURLPaths(createOrderUrl, itemId))}${!!returnUrl ? `?return_url=${returnUrl}`: ""}`;
}
