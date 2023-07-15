import { useEffect, useState } from "react";
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
    isBookmarked: boolean;

    constructor(info: Tab, isBookmarked: boolean) {
      this.info = info;
      this.isBookmarked = isBookmarked;
    }

    handleClose() {
      if (!this.info.id) return;
      chrome.tabs.remove(this.info.id);
      setAllTab((prev) => prev.filter((t) => t.info.id !== this.info.id));
      setBookmarkedTab((prev) =>
        prev.filter((t) => t.info.id !== this.info.id)
      );
    }

    handleBookmark() {
      this.isBookmarked = !this.isBookmarked;

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

      setAllTab((prev) => {
        const i = prev.findIndex((t) => t.info.id === this.info.id);
        if (!i) return prev;
        return [...prev.slice(0, i), this, ...prev.slice(i + 1)];
      });
    }
  }

  const handleGetBookmarkedTab = async () => {
    if (!chrome?.tabs) return [];
    try {
      const bookmarked: { [key: string]: TabItem[] } =
        await chrome.storage.local.get([STORAGE_KEY.BOOKMARKED]);

      if (!bookmarked || !bookmarked.BOOKMARKED) return [];
      const { BOOKMARKED } = bookmarked;

      setBookmarkedTab(BOOKMARKED);
      return BOOKMARKED;
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetAllTabs = async (BOOKMARKED: TabItem[]) => {
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
        const isBookmarked =
          BOOKMARKED && !!BOOKMARKED.find((tab) => t.id === tab.info.id);
        return new TabItem(t, isBookmarked);
      });

      setAllTab(tabItems);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // chrome.storage.local.remove([STORAGE_KEY.BOOKMARKED]);
    chrome.storage.onChanged.addListener((change, area) => {
      console.log(change, area);
    });
  }, []);

  useEffect(() => {
    handleGetBookmarkedTab()
      .then((res) => {
        if (!res) throw new Error();
        handleGetAllTabs(res);
      })
      .catch((err) => console.error(err));
  }, []);

  return { TabItem, tabs };
};
