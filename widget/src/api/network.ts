/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios";

export interface Network extends AxiosInstance {}

type EjectId = number;

type RequestInterceptor = (
  config: AxiosRequestConfig
) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
type RequestErrorInterceptor = (error: any) => any;
interface RequestPairInterceptor {
  interceptor: RequestInterceptor;
  errorInterceptor: RequestErrorInterceptor;
}

type ResponseInterceptor = (
  response: AxiosResponse
) => AxiosResponse | Promise<AxiosResponse>;
type ResponseErrorInterceptor = (error: any) => any;
interface ResponsePairInterceptor {
  interceptor: ResponseInterceptor;
  errorInterceptor: ResponseErrorInterceptor;
}

const globalRequestInterceptors = new Map<EjectId, RequestPairInterceptor>();
const globalResponseInterceptors = new Map<EjectId, ResponsePairInterceptor>();

export const addGlobalRequestInterceptors = (
  interceptor: RequestInterceptor,
  errorInterceptor: RequestErrorInterceptor
): EjectId => {
  const pair = { interceptor, errorInterceptor };
  const ejectId = axios.interceptors.request.use(interceptor, errorInterceptor);
  globalRequestInterceptors.set(ejectId, pair);
  return ejectId;
};

export const addGlobalResponseInterceptors = (
  interceptor: ResponseInterceptor,
  errorInterceptor: ResponseErrorInterceptor
): EjectId => {
  const pair = { interceptor, errorInterceptor };
  const ejectId = axios.interceptors.response.use(
    interceptor,
    errorInterceptor
  );
  globalResponseInterceptors.set(ejectId, pair);
  return ejectId;
};

export const removeGlobalRequestInterceptors = (ejectId: EjectId) => {
  globalRequestInterceptors.delete(ejectId);
  axios.interceptors.request.eject(ejectId);
};

export const removeGlobalResponseInterceptors = (ejectId: EjectId) => {
  globalResponseInterceptors.delete(ejectId);
  axios.interceptors.response.eject(ejectId);
};

class NetworkManager {
  create(...configs: AxiosRequestConfig[]): Network {
    const axiosInstance = axios.create(Object.assign({}, ...configs));
    Array.from(globalRequestInterceptors).forEach(([key, interceptorPair]) => {
      const { interceptor, errorInterceptor } = interceptorPair;
      axiosInstance.interceptors.request.use(interceptor, errorInterceptor);
    });
    Array.from(globalResponseInterceptors).forEach(([key, interceptorPair]) => {
      const { interceptor, errorInterceptor } = interceptorPair;
      axiosInstance.interceptors.response.use(interceptor, errorInterceptor);
    });
    return axiosInstance;
  }

  withSessionIdFromCookie(config?: AxiosRequestConfig): Network {
    return this.create(config || {}, {
      withCredentials: true,
    }) as AxiosInstance;
  }
}

const networkManager = new NetworkManager();
export default networkManager;
