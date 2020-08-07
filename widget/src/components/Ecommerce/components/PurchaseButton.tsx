/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {Item} from "../../../api/ecommerce/models/item";
import * as React from "react";
import {ItemHelper} from "../../../api/ecommerce/helpers/itemHelper";
import {waitForImageLoad} from "../../../utils/common";
import classNames from "classnames";
import {LoadingBarIcon} from "../../Icons/LoadingBarIcon/LoadingBarIcon";

interface Props {
  item?: Item | null;
  onClickActionOrLink?: (() => void) | string;
  text: string;
  style?: "default" | "large"
}

interface State {
  isLoadingImage: boolean;
  imageLoaded: boolean;
  loadImageError: Error | null;
}


export default class PurchaseButton extends React.Component<Props, State> {
  static defaultProps = {style: "default"};

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
    const {item} = this.props;
    const {imageLoaded, loadImageError} = this.state;
    if (!item || !imageLoaded || !!loadImageError) return undefined;
    const image = ItemHelper.getButtonBackgroundImage(item.images || []);
    return (image || {}).imageUrl;
  };

  loadImage = () => {
    const {item} = this.props;
    if (this.state.isLoadingImage || !item) return;
    const image = ItemHelper.getButtonBackgroundImage(item.images || []);
    if (!image) return;

    this.setState({isLoadingImage: true, loadImageError: null, imageLoaded: false}, () => {
      waitForImageLoad(image.imageUrl)
        .then(() => this.setState({imageLoaded: true, loadImageError: null}))
        .catch((error) => this.setState({imageLoaded: false, loadImageError: error}))
        .finally(() => this.setState({isLoadingImage: false}))
    });
  };

  render() {
    const {item, text, onClickActionOrLink, style} = this.props;
    const { imageLoaded, isLoadingImage } = this.state;

    const styles: React.CSSProperties = {};
    if (imageLoaded && style === "large") {
      styles.backgroundImage = `url(${this.getBackgroundImage()})`
    }
    return (
      <div
        className={classNames(
          "ab-wpr-purchase-btn-container",
          {"ab-wpr-purchase-btn-action-large": style === "large"}
        )}
      >
        {isLoadingImage && (
          <LoadingBarIcon/>
        )}
        {typeof onClickActionOrLink === "string" && !isLoadingImage && (
          <a
            style={styles}
            className={classNames(
              "ab-wpr-purchase-btn-action",
              {"ab-wpr-purchase-btn-action-large": (style === "large" && !!item && imageLoaded)}
            )}
            href={onClickActionOrLink}
          >
            <span>{text}</span>
          </a>
        )}
        {typeof onClickActionOrLink !== "string" && !isLoadingImage && (
          <button
            style={styles}
            className={classNames(
              "ab-wpr-purchase-btn-action",
              {"ab-wpr-purchase-btn-action-large": (style === "large" && !!item && imageLoaded)}
            )}
            onClick={onClickActionOrLink} disabled={!onClickActionOrLink}
          >
            <span>{text}</span>
          </button>
        )}
      </div>
    );
  }
}

