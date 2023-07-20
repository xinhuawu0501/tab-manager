import { useEffect, useState } from "react";
import { ITabItem, STORAGE_KEY, Tab, TabListState } from "../lib/type/Tab";

/**
 * Functionalities:
 * - Get all tab from browser
 * - Close tab
 * - Store tab
 */
export const useTabs = () => {
  const [allTab, setAllTab] = useState<ITabItem[]>([]);
  const [bookmarkedTab, setBookmarkedTab] = useState<ITabItem[]>([]);
  const [currentWindow, setCurrentWindow] = useState<chrome.windows.Window>();

  const tabs: TabListState = {
    ALL: allTab,
    BOOKMARKED: bookmarkedTab,
  };

  const handleStoreInStorage = (data: ITabItem[]) => {
    if (!data) return;
    chrome.storage.local.set({ [STORAGE_KEY.BOOKMARKED]: data });
  };

  class TabItem {
    info: Tab;
    isBookmarked: boolean;

    constructor(info: Tab, isBookmarked: boolean) {
      this.info = info;
      this.isBookmarked = isBookmarked;
    }

    async handleNavigateTo() {
      if (!this.info.id) return;
      const { id, windowId } = this.info;

      try {
        const updateWindowPromise = chrome.windows.update(windowId, {
          focused: true,
        });
        const updateTabPromise = chrome.tabs.update(id, { active: true });
        const res = Promise.allSettled([updateWindowPromise, updateTabPromise]);
        return res;
      } catch (error) {
        console.error(error);
        return;
      }
    }

    handleClose() {
      if (!this.info.id) return;
      const { id } = this.info;

      //close tab in window
      chrome.tabs.remove(id);
      setAllTab((prev) => prev.filter((t) => t.info.id !== id));
    }

    handleToggleBookmark() {
      if (!this.info.id) return;
      const { id } = this.info;

      this.isBookmarked = !this.isBookmarked;

      setBookmarkedTab((prev) => {
        let newState = [];
        const isBookmarked = !!prev.find((t) => t.info.id === id);
        if (isBookmarked) newState = prev.filter((t) => t.info.id !== id);
        else newState = prev.concat(this);

        handleStoreInStorage(newState);
        return newState;
      });

      //to update bookmark icon in `allTab` list
      setAllTab((prev) => {
        const i = prev.findIndex((t) => t.info.id === id);
        if (i == -1) return prev;
        return [...prev.slice(0, i), this, ...prev.slice(i + 1)];
      });
    }
  }

  const handleGetBookmarkedTab = async () => {
    try {
      const data: { [key: string]: ITabItem[] } =
        await chrome.storage.local.get([STORAGE_KEY.BOOKMARKED]);

      if (!data || !data.BOOKMARKED) return [];
      const { BOOKMARKED } = data;

      setBookmarkedTab(
        BOOKMARKED.map((t) => new TabItem(t.info, t.isBookmarked))
      );
      return BOOKMARKED;
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetAllTabs = async (data: ITabItem[]) => {
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
        const isBookmarked = data && !!data.find((tab) => t.id === tab.info.id);
        return new TabItem(t, isBookmarked);
      });

      setAllTab(tabItems);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenNewTab = async (url: string) => {
    await chrome.tabs.create({
      active: true,
      url: url,
      openerTabId: currentWindow?.tabs?.[0].id ?? allTab[0].info.id,
      windowId: currentWindow?.id ?? allTab[0].info.windowId,
    });
  };

  useEffect(() => {
    const handleGetCurrentWindow = async () => {
      try {
        const window = await chrome.windows.getCurrent();
        if (window) setCurrentWindow(window);
      } catch (error) {
        console.error(error);
      }
    };
    handleGetCurrentWindow();
  }, []);

  useEffect(() => {
    // chrome.storage.local.remove([STORAGE_KEY.BOOKMARKED]);
    chrome.storage.onChanged.addListener((change, area) => {
      console.log(change, area);
    });

    chrome.tabs.onCreated.addListener((tab) => {
      console.log("created", tab);
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

  return { tabs, handleOpenNewTab, currentWindow };
};
