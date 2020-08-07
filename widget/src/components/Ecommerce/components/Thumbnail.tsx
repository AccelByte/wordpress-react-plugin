/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import * as React from "react";
import {Item} from "../../../api/ecommerce/models/item";
import {ItemHelper} from "../../../api/ecommerce/helpers/itemHelper";
import {waitForImageLoad} from "../../../utils/common";
import {LoadingBarIcon} from "../../Icons/LoadingBarIcon/LoadingBarIcon";
import ImageIcon from "../../Icons/ImageIcon";
import ConsoleIcon from "../../Icons/ConsoleIcon";

interface Props {
  item?: Item | null;
}
interface State {
  isLoadingImage: boolean;
  imageLoaded: boolean;
  loadImageError: Error | null;
}

export default class Thumbnail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      imageLoaded: false,
      isLoadingImage: false,
      loadImageError: null,
    };
  }

  componentDidMount(): void {
    this.loadImage();
  }

  getBackgroundImage = (): string | undefined => {
    const { item } = this.props;
    const { imageLoaded, loadImageError } = this.state;
    if (!item || !imageLoaded || !!loadImageError) return undefined;
    const image = ItemHelper.getBackgroundImage(item.images || []);
    return (image || {}).imageUrl;
  };

  loadImage = () => {
    const { item } = this.props;
    if (this.state.isLoadingImage || !item) return;
    const image = ItemHelper.getBackgroundImage(item.images || []);
    if (!image) return;

    this.setState({ isLoadingImage: true, loadImageError: null, imageLoaded: false}, () => {
      waitForImageLoad(image.imageUrl)
        .then(() => this.setState({ imageLoaded: true, loadImageError: null }))
        .catch((error) => this.setState({ imageLoaded: false, loadImageError: error }))
        .finally(() => this.setState({ isLoadingImage: false }))
    });
  };

  render() {
    const { item } = this.props;
    const { isLoadingImage, imageLoaded } = this.state;
    const styles: React.CSSProperties = {};
    if (imageLoaded) {
      styles.backgroundImage = `url(${this.getBackgroundImage()})`
    }
    return (
      <div
        className={"ab-wpr-purchase-large-container-img ab-wpr-stripe-bg"}
        style={styles}
      >
        {isLoadingImage && (<LoadingBarIcon  />)}
        {!isLoadingImage && !item && (
          <span>
            <ImageIcon />
            <p>Error fetching Item Information</p>
          </span>
        )}
        {!isLoadingImage && !!item && !imageLoaded && (
          <span>
            <ConsoleIcon />
          </span>
        )}
      </div>
    )

  }
}
