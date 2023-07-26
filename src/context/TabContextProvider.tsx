import {
  PropsWithChildren,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  ITabItem,
  MoveProperties,
  STORAGE_KEY,
  Tab,
  TabListState,
} from "../lib/type/Tab";

type TabContext = {
  ALL: ITabItem[];
  BOOKMARKED: ITabItem[];
  window?: chrome.windows.Window;
  handleMoveTab: Function;
  handleOpenNewTab: Function;
};

export const TabCtx = createContext<TabContext>({
  ALL: [],
  BOOKMARKED: [],
  window: undefined,
  handleMoveTab: () => {},
  handleOpenNewTab: () => {},
});

export const TabContextProvider = ({ children }: PropsWithChildren) => {
  const [allTab, setAllTab] = useState<ITabItem[]>([]);
  const [bookmarkedTab, setBookmarkedTab] = useState<ITabItem[]>([]);
  const [currentWindow, setCurrentWindow] = useState<chrome.windows.Window>();

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

        chrome.storage.local.set({ [STORAGE_KEY.BOOKMARKED]: newState });
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

  const getAllTabs = async (data?: ITabItem[]) => {
    try {
      const tabs = await chrome.tabs.query({});
      const [currentTab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });

      const sortedTab = [
        currentTab,
        ...tabs.filter((t) => t.id !== currentTab.id),
      ];

      return sortedTab.map((t) => {
        const isBookmarked = data
          ? !!data.find((tab) => t.id === tab.info.id)
          : false;
        return new TabItem(t, isBookmarked);
      });
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const getBookmarkedTab = async () => {
    try {
      const data: { [key: string]: ITabItem[] } =
        await chrome.storage.local.get([STORAGE_KEY.BOOKMARKED]);

      return data.BOOKMARKED.map((t) => new TabItem(t.info, t.isBookmarked));
    } catch (error) {
      console.error(error);
      return [];
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

      allTab[index].info.windowId = tab.windowId;

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

  const contextValue = {
    ALL: allTab,
    BOOKMARKED: bookmarkedTab,
    window: currentWindow,
    handleMoveTab: handleMoveTab,
    handleOpenNewTab: handleOpenNewTab,
  };

  useEffect(() => {
    const getInitialTabs = async () => {
      try {
        const bookmarkedTabs = await getBookmarkedTab();
        const allTabs = await getAllTabs(bookmarkedTabs);

        setAllTab(allTabs);
        setBookmarkedTab(bookmarkedTabs);
      } catch (error) {}
    };

    getInitialTabs();
  }, []);

  useEffect(() => {
    const getInitialWindow = async () => {
      try {
        const window = await chrome.windows.getCurrent();
        if (window) setCurrentWindow(window);
      } catch (error) {}
    };

    getInitialWindow();
  }, []);

  return <TabCtx.Provider value={contextValue}>{children}</TabCtx.Provider>;
};
