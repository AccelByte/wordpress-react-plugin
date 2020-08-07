/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import {Container} from "unstated";
import {Entitlement} from "../../api/ecommerce/models/entitlements";
import {Item, ItemTypeNotSupported} from "../../api/ecommerce/models/item";
import networkManager from "../../api/network";
import {fetchEntitlementsByItemId} from "../../api/ecommerce/entitlements";
import {fetchItem} from "../../api/ecommerce/item";
import {ElligibleUser, User} from "../../api/user/models/user";
import {EcommerceHelper} from "../../api/ecommerce/helpers/ecommerceHelper";
import {ItemHelper} from "../../api/ecommerce/helpers/itemHelper";

interface Props {
  itemId: string;
  user?: User | null;
}
interface State {
  item: Item | null;
  isFetchingItem: boolean;
  fetchItemError: Error | null;
  itemEntitlement: Entitlement[];
  isFetchingEntitlement: boolean;
  fetchEntitlementError: Error | null;
}

export const ButtonStyle = {
  Large: "large",
  Default: "default"
};

export class PurchaseButtonLogic extends Container<State> {
  readonly props: Props;

  constructor(props: Props) {
    super();
    this.props = props;
    this.state = {
      item: null,
      isFetchingItem: false,
      fetchItemError: null,
      itemEntitlement: [],
      isFetchingEntitlement: false,
      fetchEntitlementError: null,
    };
  }

  init = () => {
    this.fetchEntitlement();
    this.fetchItem();
  };

  fetchItem = async () => {
    const { itemId } = this.props;
    if (!itemId || this.state.isFetchingItem) return;
    this.setState({ isFetchingItem: true });
    try {
      const item = await fetchItem(itemId).then((result) => {
        if (result.error) throw result.error;
        if (!ItemHelper.isItemTypeSupported(result.response.data)) throw new ItemTypeNotSupported();

        return result.response.data;
      });
      this.setState({ item, fetchItemError: null});
    } catch (fetchItemError) {
      this.setState({ fetchItemError, item: null })
    } finally {
      this.setState({ isFetchingItem: false });
    }
  };

  fetchEntitlement = async () => {
    const { user, itemId } = this.props;
    if (!user || !ElligibleUser.is(user) || !itemId || this.state.isFetchingEntitlement) return;
    this.setState({ isFetchingEntitlement: true });
    try {
      const network = networkManager.withSessionIdFromCookie();
      const itemEntitlement = await fetchEntitlementsByItemId(network, user.userId, itemId).then((result) => {
        if (result.error) throw result.error;
        return result.response.data.data;
      });
      this.setState({ itemEntitlement, fetchEntitlementError: null });
    } catch (fetchEntitlementError) {
      this.setState({ fetchEntitlementError, itemEntitlement: [] });
    } finally {
      this.setState({ isFetchingEntitlement: false });
    }
  };

  isLoading = () => {
    const {isFetchingItem, isFetchingEntitlement} = this.state;
    return (isFetchingItem || isFetchingEntitlement);
  };

  isError = () => {
    const { fetchItemError, fetchEntitlementError } = this.state;
    return (!!fetchItemError || !!fetchEntitlementError);
  };

  isItemOwned = (): boolean => {
    const { item, itemEntitlement } = this.state;
    if (!item || !itemEntitlement || this.isError() || this.isLoading()) return false;
    return EcommerceHelper.getItemEntitlementCount(item.itemId, itemEntitlement) > 0;
  };

  isItemPurchaseAble = (): boolean => {
    const { item, itemEntitlement } = this.state;
    if (!item || this.isError() || this.isLoading()) return false;
    if (!!itemEntitlement) {
      return EcommerceHelper.isItemPurchaseAbleWithEntitlementCheck(item, itemEntitlement);
    }
    return EcommerceHelper.isItemPurchaseAble(item);
  }
}
