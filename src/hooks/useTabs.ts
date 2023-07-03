import { useEffect, useReducer, useState } from "react";

export type Tab = Pick<
  chrome.tabs.Tab,
  "id" | "url" | "title" | "index" | "favIconUrl"
>;

export enum TabActionType {
  GET_ALL = "GET_ALL",
  CLOSE = "CLOSE",
}

export interface TabAction {
  type: TabActionType;
  payload?: TabItem[];
}

export class TabItem {
  info: Tab;

  constructor(info: Tab) {
    this.info = info;
  }

  handleClose() {
    if (!this.info?.id) return;
    chrome.tabs.remove(this.info.id);
  }
}

const handleGetAllTabs = async () => {
  if (!chrome?.tabs) return;
  try {
    const tabs = await chrome.tabs.query({});
    if (tabs[0]) {
      const tabItems = tabs.map((t) => new TabItem(t));
      return tabItems;
    }
  } catch (e) {
    console.error(e);
  }
};

const reducer = (state: TabItem[], action: TabAction) => {
  const { type, payload } = action;
  switch (type) {
    case TabActionType.GET_ALL: {
      if (!payload?.[0]) return state;
      return payload;
    }

    case TabActionType.CLOSE: {
      if (!payload?.[0]) return state;
      const [tab] = payload;
      tab.handleClose();
      const filteredState = state.filter((t) => t.info.id !== tab.info.id);
      return filteredState;
    }
  }
};

export const useTabs = () => {
  const [tabState, dispatch] = useReducer(reducer, []);
  console.log("use tab", tabState);
  useEffect(() => {
    handleGetAllTabs().then((tabs) =>
      dispatch({ type: TabActionType.GET_ALL, payload: tabs })
    );
  }, []);

  return { tabState, dispatch };
};
