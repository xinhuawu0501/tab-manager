import { Tab } from "../../hooks/useTabs";

export interface ITabItem {
  info: Tab;
  isBookmarked: boolean;
  handleClose: () => void;
  handleBookmark: () => void;
}

export type Catogories = "ALL" | "BOOKMARKED";

export type TabListState = {
  [k in Catogories]: ITabItem[];
};
