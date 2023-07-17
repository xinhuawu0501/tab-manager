import { Tab } from "../../hooks/useTabs";

export interface ITabItem {
  info: Tab;
  isBookmarked: boolean;
  handleNavigateTo: () => void;
  handleClose: () => void;
  handleToggleBookmark: () => void;
}

export type Catogories = "ALL" | "BOOKMARKED";

export type TabListState = {
  [k in Catogories]: ITabItem[];
};
