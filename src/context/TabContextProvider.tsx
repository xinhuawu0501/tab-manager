import {
  PropsWithChildren,
  Reducer,
  createContext,
  useEffect,
  useReducer,
} from "react";

import {
  Action,
  ActionType,
  DragData,
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
  window: undefined,
};

const reducer = (state: TabListState, action: Action): TabListState => {
  const { payload, initState, dragData } = action;

  switch (action.type) {
    case ActionType.INIT: {
      if (initState) return { ...state, ...initState };
      else return state;
    }

    case ActionType.CLOSE: {
      const newAllTabState = state.ALL.filter(
        (t: ITabItem) => t.info.id !== payload?.info.id
      );
      return {
        ...state,
        ALL: newAllTabState,
      };
    }

    case ActionType.OPEN_NEW: {
      if (!payload) return state;
      return { ...state, ALL: state.ALL.concat(payload) };
    }

    case ActionType.TOGGLE_BOOKMARK: {
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
      return { ...state, ALL: newAllTabState, BOOKMARKED: newBookmarkedState };
    }

    case ActionType.UPDATE: {
      if (!dragData) return state;
      const { ALL } = state;
      const { windowId, source, destination, tabId } = dragData;

      const moveTargetItem = ALL[source];
      if (windowId) moveTargetItem.info.windowId = windowId;

      const newState = [...ALL];

      newState.splice(source, 1);
      newState.splice(destination, 0, moveTargetItem);

      return {
        ...state,
        ALL: newState,
      };
    }

    default:
      return state;
  }
};

export const TabContextProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer<Reducer<TabListState, Action>>(
    reducer,
    initialState
  );

  const { ALL, window, BOOKMARKED } = state;

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
        const response = await Promise.allSettled([
          updateWindowPromise,
          updateTabPromise,
        ]);

        const isFullfilled = response.every(
          (res) => res.status === "fulfilled"
        );

        if (!isFullfilled) return;
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

    async handleMoveTab(data: DragData) {
      try {
        const { id } = this.info;
        if (!id) return;
        const { windowId, indexInGroup } = data;
        const moveProperties: MoveProperties = {
          index: indexInGroup,
        };
        if (windowId) moveProperties.windowId = windowId;
        const tab = await chrome.tabs.move(id, moveProperties);
        if (!tab) throw new Error("Fail to move tab");

        dispatch({
          type: ActionType.UPDATE,
          dragData: { ...data, tabId: id },
        });
      } catch (error) {
        console.error(error);
      }
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

      if (!data?.BOOKMARKED) return [];

      return data.BOOKMARKED.map((t) => new TabItem(t.info, t.isBookmarked));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleMoveTab = async (data: DragData) => {
    // try {
    //   const { tabId, destination, windowId } = data;
    //   const moveProperties: MoveProperties = {
    //     index: destination,
    //   };
    //   if (windowId) moveProperties.windowId = windowId;
    //   const tab = await chrome.tabs.move(tabId, moveProperties);
    //   if (!tab) throw new Error("Fail to move tab");
    //   dispatch({
    //     type: ActionType.UPDATE,
    //     dragData: data,
    //   });
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const contextValue = {
    ...state,
    window: window,
    handleMoveTab: handleMoveTab,
  };

  useEffect(() => {
    const getInitialTabs = async () => {
      try {
        const bookmarkedTabs = await getBookmarkedTab();
        const allTabs = await getAllTabs(bookmarkedTabs);
        if (!bookmarkedTabs || !allTabs) throw new Error("Fail to get tabs");

        dispatch({
          type: ActionType.INIT,
          initState: { ALL: allTabs, BOOKMARKED: bookmarkedTabs },
        });
      } catch (error) {
        console.error(error);
      }
    };

    getInitialTabs();
  }, []);

  useEffect(() => {
    const getInitialWindow = async () => {
      try {
        const window = await chrome.windows.getCurrent();
        if (!window) throw new Error("Fail to get current window");
        dispatch({
          type: ActionType.INIT,
          initState: { window: window },
        });
      } catch (error) {
        console.error(error);
      }
    };

    getInitialWindow();
  }, []);

  useEffect(() => {
    if (!BOOKMARKED) return;

    chrome.storage.local.set({ [STORAGE_KEY.BOOKMARKED]: BOOKMARKED });
  }, [BOOKMARKED.length]);

  useEffect(() => {
    chrome.storage.onChanged.addListener((change, area) => {
      console.log(change, area);
    });
  }, []);

  return <TabCtx.Provider value={contextValue}>{children}</TabCtx.Provider>;
};
