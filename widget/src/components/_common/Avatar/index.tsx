/*
 * Copyright (c) 2019 AccelByte Inc. All Rights Reserved.
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as React from "react";
import {waitForImageLoad} from "../../../utils/common";
import {LoadingBarIcon} from "../../Icons/LoadingBarIcon/LoadingBarIcon";
import AvatarDefault from "src/assets/images/avatarDefault.png";
import WithPropsGuard from "../../utils/WithPropsGuard";

interface Props {
  isLoading: boolean;
  imageUrl?: string;
  className?: string;
}

interface State {
  imageLoaded: boolean;
  isLoadingImage: boolean;
  error?: Error | null;
}

class Avatar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      imageLoaded: false,
      isLoadingImage: false,
      error: undefined,
    }
  }

  componentDidMount(): void {
    const { imageUrl } = this.props;
    if (this.state.isLoadingImage) return;
    this.setState({ isLoadingImage: true });

    waitForImageLoad(imageUrl).then(() => {
      this.setState({ imageLoaded: true });
    }).finally(() => {
      this.setState({
        isLoadingImage: false
      })
    });
  }

  render() {
    const {imageUrl, isLoading, className} = this.props;
    const {isLoadingImage, imageLoaded} = this.state;

    return (
      <div className={className}>
        {(isLoadingImage || isLoading) && <LoadingBarIcon />}
        {!isLoadingImage && !isLoading && (
          <img src={imageLoaded ? imageUrl : AvatarDefault}/>
        )}
      </div>
    )

  }
}

const AvatarWithPropsGuard = WithPropsGuard<Props>(Avatar, (prevProps, nextProps) => {
  return prevProps.isLoading !== nextProps.isLoading || prevProps.imageUrl !== nextProps.imageUrl;
});

export default AvatarWithPropsGuard;
