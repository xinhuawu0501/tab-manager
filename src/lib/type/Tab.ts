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
