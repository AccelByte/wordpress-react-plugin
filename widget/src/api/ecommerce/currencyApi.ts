/*
 * Copyright (c) 2020 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

import { Container } from "unstated";
import {CurrencyMap} from "./models/currency";
import {fetchCurrencies} from "./currency";
import {CurrencyHelper} from "./helpers/currencyHelper";

interface State {
  currencies: CurrencyMap;
  error: Error | null;
  isFetching: boolean;
}

export class CurrencyApi extends Container<State> {
  constructor() {
    super();
    this.state = {
      isFetching: false,
      currencies: new Map(),
      error: null,
    };
    this.fetchCurrency();
  }

  async fetchCurrency() {
    if (this.state.isFetching) return;
    try {
      await this.setState({ isFetching: true, error: null });
      const currency = await fetchCurrencies().then((result) => {
        if (result.error) throw result.error;
        return CurrencyHelper.currencyToMap(result.response.data);
      });
      this.setState({ currencies: currency, error: null });
    } catch (error) {
      await this.setState({ error });
    } finally {
      await this.setState({ isFetching: false });
    }
  }
}

export default new CurrencyApi();
