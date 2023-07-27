export enum STORAGE_KEY {
  BOOKMARKED = "BOOKMARKED",
}

export type Tab = Pick<
  chrome.tabs.Tab,
  "id" | "url" | "title" | "index" | "favIconUrl" | "windowId"
>;

export interface MoveProperties {
  index: number;
  windowId?: number;
}
export interface ITabItem {
  info: Tab;
  isBookmarked: boolean;
  searchedIndexes?: number[];
  handleNavigateTo: (url: string) => void;
  handleClose: () => void;
  handleToggleBookmark: () => void;
}

export type Catogories = "ALL" | "BOOKMARKED";

export type TabListState = {
  [k in Catogories]: ITabItem[];
};

export enum ActionType {
  INIT = "INIT",
  OPEN_NEW = "OPEN_NEW",
  CLOSE = "CLOSE",
  TOGGLE_BOOKMARK = "TOGGLE_BOOKMARK",
}

export type Action = {
  type: ActionType;
  payload?: ITabItem;
  initState?: TabListState;
};

export type TabContext = {
  ALL: ITabItem[];
  BOOKMARKED: ITabItem[];
  window?: chrome.windows.Window;
  handleMoveTab: Function;
};
