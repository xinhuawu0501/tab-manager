import { useState } from "react";
import {
  ITabItem,
  MoveProperties,
  STORAGE_KEY,
  Tab,
  TabListState,
} from "../lib/type/Tab";

export const handleGroupTabsByWindow = (tabs: ITabItem[]) => {
  const groups: { [id: number]: ITabItem[] } = {};

  for (const tab of tabs) {
    const { windowId } = tab.info;
    groups[windowId] ||= [];
    groups[windowId].push(tab);
  }

  return groups;
};

const handleStoreInStorage = (data: ITabItem[]) => {
  if (!data) return;
  chrome.storage.local.set({ [STORAGE_KEY.BOOKMARKED]: data });
};

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

  class TabItem {
    info: Tab;
    isBookmarked: boolean;
    searchedIndexes?: number[];

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

  const handleOpenNewTab = async (url: string) => {
    await chrome.tabs.create({
      active: true,
      url: url,
      openerTabId: currentWindow?.tabs?.[0].id ?? allTab[0].info.id,
      windowId: currentWindow?.id ?? allTab[0].info.windowId,
    });
  };

  const handleMoveTab = async (
    moveProperties: MoveProperties,
    tabId: number
  ) => {
    try {
      const tab = await chrome.tabs.move(tabId, moveProperties);
      if (!tab) return;

      const index = allTab.findIndex((t) => t.info.id == tabId);
      if (index === -1) return;

      console.log(allTab[index].info.windowId);
      allTab[index].info.windowId = tab.windowId;
      console.log(allTab[index].info.windowId);
      setAllTab((prev) => [
        ...prev.slice(0, index),
        allTab[index],
        ...prev.slice(index + 1),
      ]);

      return tab;
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return { handleOpenNewTab, handleMoveTab };
};
