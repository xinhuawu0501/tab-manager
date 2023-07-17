import { Tab } from "../../hooks/useTabs";

export interface ITabItem {
  info: Tab;
  isBookmarked: boolean;
  handleNavigateTo: () => Promise<Tab | undefined>;
  handleClose: () => void;
  handleToggleBookmark: () => void;
}

export type Catogories = "ALL" | "BOOKMARKED";

export type TabListState = {
  [k in Catogories]: ITabItem[];
};
