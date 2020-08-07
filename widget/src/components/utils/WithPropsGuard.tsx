/*
 * Copyright (c) 2020. AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as React from "react";
import { Keygen } from "./keygen";

export type PropsGuardFeatures = Partial<{
  propsGuardRefresh:  () => void;
}>

export type WithoutPropsGuardFeature<T extends PropsGuardFeatures> = Omit<T, keyof PropsGuardFeatures>

export default function<P extends (object & PropsGuardFeatures)>(
  Component: React.ComponentType<P>,
  guard: (prevProps: WithoutPropsGuardFeature<P>, nextProps: WithoutPropsGuardFeature<P>) => boolean
) {
  type State = {
    key: string;
    oldProps: WithoutPropsGuardFeature<P>;
    keygen: IterableIterator<string>;
  };

  return class extends React.Component<WithoutPropsGuardFeature<P>, State> {
    static getDerivedStateFromProps(nextProps: WithoutPropsGuardFeature<P>, state: State) {
      if (guard(state.oldProps, nextProps)) {
        return {
          key: state.keygen.next().value,
          oldProps: nextProps,
        };
      }
      return null;
    }

    constructor(props: WithoutPropsGuardFeature<P>) {
      super(props);
      this.state = {
        keygen: Keygen(),
        oldProps: props,
        key: "1",
      };
    }

    refresh = () => {
      this.setState({ key: this.state.keygen.next().value })
    };

    render() {
      return (
        <Component key={this.state.key} propsGuardRefresh={this.refresh} {...this.props as P}>
          {this.props.children}
        </Component>
      );
    }
  };
}
