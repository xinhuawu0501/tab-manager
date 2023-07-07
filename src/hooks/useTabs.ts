import { useEffect, useReducer, useState } from "react";
import { ITabItem, TabListState } from "../lib/type/Tab";

export type Tab = Pick<
  chrome.tabs.Tab,
  "id" | "url" | "title" | "index" | "favIconUrl"
> & { bookmarked: boolean };

export enum TabActionType {
  GET_ALL = "GET_ALL",
  CLOSE = "CLOSE",
  BOOKMARK = "BOOKMARK",
}

export enum STORAGE_KEY {
  BOOKMARKED = "BOOKMARKED",
}

const initState: TabListState = {
  ALL: [],
  BOOKMARKED: [],
};

/**
 * Functionalities:
 * - Get all tab from browser
 * - Close tab
 * - Store tab
 * @returns
 */
export const useTabs = () => {
  const [allTab, setAllTab] = useState<TabItem[]>([]);
  const bookmarkedTab = allTab.filter((t) => t.info.bookmarked);

  const tabs: TabListState = {
    ALL: allTab,
    BOOKMARKED: bookmarkedTab,
  };
  class TabItem implements ITabItem {
    info: Tab;

    constructor(info: Tab) {
      this.info = info;
    }

    handleClose() {
      if (!this.info?.id) return;
      chrome.tabs.remove(this.info.id);
      setAllTab((prev) => prev.filter((t) => t.info.id !== this.info.id));
    }

    handleBookmark() {
      const index = allTab.findIndex((t) => t.info.id === this.info.id);
      this.info.bookmarked = !this.info.bookmarked;
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

      const bookmarked: { [key: string]: Tab[] } =
        await chrome.storage.local.get([STORAGE_KEY.BOOKMARKED]);
      const { BOOKMARKED } = bookmarked;
      if (!tabs[0] || !currentTab) return;
      const sortedTab = [
        currentTab,
        ...tabs.filter((t) => t.id !== currentTab.id),
      ];

      const tabItems = sortedTab.map((t) => {
        const isBookmarked = !!BOOKMARKED?.find((b) => b.id === t.id);
        return new TabItem({ ...t, bookmarked: isBookmarked });
      });

      setAllTab(tabItems);
      return tabItems;
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
    chrome.storage.local.set({ [STORAGE_KEY.BOOKMARKED]: bookmarkedTab });
  }, [bookmarkedTab]);

  return { TabItem, tabs };
};
