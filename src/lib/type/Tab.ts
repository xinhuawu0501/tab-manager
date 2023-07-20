export enum STORAGE_KEY {
  BOOKMARKED = "BOOKMARKED",
}

export type Tab = Pick<
  chrome.tabs.Tab,
  "id" | "url" | "title" | "index" | "favIconUrl" | "windowId"
>;

export interface ITabItem {
  info: Tab;
  isBookmarked: boolean;
  handleNavigateTo: () => Promise<
    | [
        PromiseSettledResult<chrome.windows.Window>,
        PromiseSettledResult<chrome.tabs.Tab>
      ]
    | undefined
  >;
  handleClose: () => void;
  handleToggleBookmark: () => void;
}

export type Catogories = "ALL" | "BOOKMARKED";

export type TabListState = {
  [k in Catogories]: ITabItem[];
};
