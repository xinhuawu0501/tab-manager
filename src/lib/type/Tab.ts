import { DraggableLocation } from "react-beautiful-dnd";

export enum STORAGE_KEY {
  BOOKMARKED = "BOOKMARKED",
}

type TabProperties =
  | "id"
  | "url"
  | "title"
  | "index"
  | "favIconUrl"
  | "windowId";

export type Tab = Pick<chrome.tabs.Tab, TabProperties>;

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
  handleMoveTab: (data: DragData) => void;
}

export type Catogories = "ALL" | "BOOKMARKED";

type CurrentWindow = { window: chrome.windows.Window | undefined };

export type TabListState = {
  [k in Catogories]: ITabItem[];
} & CurrentWindow;

export enum ActionType {
  INIT = "INIT",
  OPEN_NEW = "OPEN_NEW",
  CLOSE = "CLOSE",
  TOGGLE_BOOKMARK = "TOGGLE_BOOKMARK",
  UPDATE = "UPDATE",
  SET_WINDOW = "SET_WINDOW",
}

export interface DragData {
  source: number;
  destination: number;
  windowId?: number;
  tabId?: number;
  indexInGroup: number;
}

export type Action = {
  type: ActionType;
  payload?: ITabItem;
  initState?: Partial<TabListState & CurrentWindow>;
  dragData?: DragData;
};

export type TabContext = {
  ALL: ITabItem[];
  BOOKMARKED: ITabItem[];
  window?: chrome.windows.Window;
};
