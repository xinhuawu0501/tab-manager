import { useEffect, useReducer, useState } from "react";
import { ITabItem, TabListState } from "../lib/type/Tab";

export type Tab = Pick<
  chrome.tabs.Tab,
  "id" | "url" | "title" | "index" | "favIconUrl"
>;

export enum TabActionType {
  GET_ALL = "GET_ALL",
  CLOSE = "CLOSE",
  BOOKMARK = "BOOKMARK",
}

export enum STORAGE_KEY {
  BOOKMARKED = "BOOKMARKED",
}
/**
 * Functionalities:
 * - Get all tab from browser
 * - Close tab
 * - Store tab
 */
export const useTabs = () => {
  const [allTab, setAllTab] = useState<TabItem[]>([]);
  const [bookmarkedTab, setBookmarkedTab] = useState<TabItem[]>([]);

  const tabs: TabListState = {
    ALL: allTab,
    BOOKMARKED: bookmarkedTab,
  };

  const handleStoreInStorage = (data: TabItem[]) => {
    if (!data) return;
    chrome.storage.local.set({ [STORAGE_KEY.BOOKMARKED]: data });
  };

  class TabItem implements ITabItem {
    info: Tab;

    constructor(info: Tab) {
      this.info = info;
    }

    handleClose() {
      if (!this.info.id) return;
      chrome.tabs.remove(this.info.id);
      setAllTab((prev) => prev.filter((t) => t.info.id !== this.info.id));
    }

    handleBookmark() {
      if (!this.info.id) return;
      setBookmarkedTab((prev) => {
        let newState = [];
        //if the tab is bookmarked -> remove from bookmarked state
        if (!!prev.find((t) => t.info.id === this.info.id)) {
          newState = prev.filter((t) => t.info.id !== this.info.id);
        } else {
          newState = prev.concat(this);
        }
        handleStoreInStorage(newState);
        return newState;
      });
    }
  }

  const handleGetBookmarkedTab = async () => {
    if (!chrome?.tabs) return;
    try {
      const bookmarked: { [key: string]: TabItem[] } =
        await chrome.storage.local.get([STORAGE_KEY.BOOKMARKED]);

      const { BOOKMARKED } = bookmarked;
      setBookmarkedTab(BOOKMARKED);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetAllTabs = async () => {
    if (!chrome?.tabs) return;
    try {
      const tabs = await chrome.tabs.query({});
      const [currentTab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });

      if (!tabs[0] || !currentTab) return;
      const sortedTab = [
        currentTab,
        ...tabs.filter((t) => t.id !== currentTab.id),
      ];

      const tabItems = sortedTab.map((t) => {
        return new TabItem(t);
      });

      setAllTab(tabItems);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    chrome.storage.onChanged.addListener((change, area) => {
      console.log(change, area);
    });

    handleGetAllTabs();
  }, []);

  useEffect(() => {
    handleGetBookmarkedTab();
  }, []);

  return { TabItem, tabs };
};
