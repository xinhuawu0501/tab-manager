import {
  PropsWithChildren,
  Reducer,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  Action,
  ActionType,
  ITabItem,
  MoveProperties,
  STORAGE_KEY,
  Tab,
  TabContext,
  TabListState,
} from "../lib/type/Tab";

export const TabCtx = createContext<TabContext>({
  ALL: [],
  BOOKMARKED: [],
  window: undefined,
  handleMoveTab: () => {},
});

const initialState: TabListState = {
  ALL: [],
  BOOKMARKED: [],
};

function reducer(state: TabListState, action: Action): TabListState {
  const { payload, initState } = action;
  switch (action.type) {
    case "INIT": {
      if (initState) return initState;
      return state;
    }
    case "CLOSE": {
      const newAllTabState = state.ALL.filter(
        (t: ITabItem) => t.info.id !== payload?.info.id
      );
      return {
        ...state,
        ALL: newAllTabState,
      };
    }
    case "OPEN_NEW": {
      if (!payload) return state;
      return { ...state, ALL: state.ALL.concat(payload) };
    }
    case "TOGGLE_BOOKMARK": {
      if (!payload) return state;
      const { id } = payload.info;
      const { ALL, BOOKMARKED } = state;
      const isBookmarked = BOOKMARKED.find((t: ITabItem) => t.info.id === id);

      let newBookmarkedState: ITabItem[] = [];
      let newAllTabState: ITabItem[] = [];
      if (isBookmarked) {
        newBookmarkedState = BOOKMARKED.filter(
          (t: ITabItem) => t.info.id !== id
        );
      } else newBookmarkedState = BOOKMARKED.concat(payload);

      const indexInAllTab = ALL.findIndex((t: ITabItem) => t.info.id === id);
      newAllTabState =
        indexInAllTab === -1
          ? ALL
          : [
              ...ALL.slice(0, indexInAllTab),
              payload,
              ...ALL.slice(indexInAllTab + 1),
            ];
      return { ALL: newAllTabState, BOOKMARKED: newBookmarkedState };
    }
    default:
      return state;
  }
}

export const TabContextProvider = ({ children }: PropsWithChildren) => {
  const [allTab, setAllTab] = useState<ITabItem[]>([]);
  const [currentWindow, setCurrentWindow] = useState<chrome.windows.Window>();
  const [state, dispatch] = useReducer<Reducer<TabListState, Action>>(
    reducer,
    initialState
  );

  const { ALL, BOOKMARKED } = state;

  const handleOpenNewTab = async (url: string) => {
    try {
      await chrome.tabs.create({
        active: true,
        url: url,
        openerTabId: currentWindow?.tabs?.[0].id ?? ALL[0].info.id,
        windowId: currentWindow?.id ?? ALL[0].info.windowId,
      });
    } catch (error) {
      console.error(error);
    }
  };
  class TabItem {
    info: Tab;
    isBookmarked: boolean;
    searchedIndexes?: number[];

    constructor(info: Tab, isBookmarked: boolean) {
      this.info = info;
      this.isBookmarked = isBookmarked;
    }

    async handleNavigateTo(url?: string) {
      if (!this.info.id) return;
      const { id, windowId } = this.info;

      try {
        const updateWindowPromise = chrome.windows.update(windowId, {
          focused: true,
        });
        const updateTabPromise = chrome.tabs.update(id, { active: true });
        const response = await Promise.allSettled([
          updateWindowPromise,
          updateTabPromise,
        ]);

        if (response.find((r) => r.status === "rejected") && url)
          await handleOpenNewTab(url);
      } catch (error) {
        console.error(error);
      }
    }

    handleClose() {
      if (!this.info.id) return;
      const { id } = this.info;

      chrome.tabs.remove(id);
      dispatch({ type: ActionType.CLOSE, payload: this });
    }

    handleToggleBookmark() {
      if (!this.info.id) return;
      this.isBookmarked = !this.isBookmarked;
      dispatch({ type: ActionType.TOGGLE_BOOKMARK, payload: this });
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
    ...state,
    window: currentWindow,
    handleMoveTab: handleMoveTab,
  };

  useEffect(() => {
    const getInitialTabs = async () => {
      try {
        const bookmarkedTabs = await getBookmarkedTab();
        const allTabs = await getAllTabs(bookmarkedTabs);

        dispatch({
          type: ActionType.INIT,
          initState: { ALL: allTabs, BOOKMARKED: bookmarkedTabs },
        });
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
