import { useEffect, useReducer } from "react";
import { TabListState } from "../lib/type/Tab";

export type Tab = Pick<
  chrome.tabs.Tab,
  "id" | "url" | "title" | "index" | "favIconUrl"
> & { bookmarked: boolean };

export enum TabActionType {
  GET_ALL = "GET_ALL",
  CLOSE = "CLOSE",
  BOOKMARK = "BOOKMARK",
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

  handleBookmark() {
    chrome.storage.local.set({ bookmarkedTabs: [this.info] });
  }
}

const handleGetAllTabs = async () => {
  if (!chrome?.tabs) return;
  try {
    const tabs = await chrome.tabs.query({});
    const [currentTab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tabs[0] && currentTab) {
      const sortedTab = [
        currentTab,
        ...tabs.filter((t) => t.id !== currentTab.id),
      ];
      const tabItems = sortedTab.map((t) => {
        const tab = { ...t, bookmarked: false };
        return new TabItem(tab);
      });

      return tabItems;
    }
  } catch (e) {
    console.error(e);
  }
};

const reducer = (state: TabListState, action: TabAction) => {
  const { type, payload } = action;
  switch (type) {
    case TabActionType.GET_ALL: {
      if (!payload?.[0]) return state;
      return { ...state, ALL: payload };
    }

    case TabActionType.CLOSE: {
      if (!payload?.[0]) return state;
      const [tab] = payload;
      tab.handleClose();
      const filteredState = state["ALL"].filter(
        (t) => t.info.id !== tab.info.id
      );
      return { ...state, ALL: filteredState };
    }

    case TabActionType.BOOKMARK: {
      if (!payload?.[0]) return state;
      const [tab] = payload;
      tab.handleBookmark();

      return state;
    }

    default:
      return state;
  }
};

const initState: TabListState = {
  ALL: [],
  BOOKMARKED: [],
};

export const useTabs = () => {
  const [tabState, dispatch] = useReducer(reducer, initState);
  useEffect(() => {
    chrome.storage.onChanged.addListener((change, area) => {
      console.log(change, area);
    });

    handleGetAllTabs().then((tabs) =>
      dispatch({ type: TabActionType.GET_ALL, payload: tabs })
    );
  }, []);

  return { tabState, dispatch };
};
