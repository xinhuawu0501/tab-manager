import { TabItem } from "../../hooks/useTabs";

export type Catogories = "ALL" | "BOOKMARKED";

export type TabListState = {
  [k in Catogories]: TabItem[];
};
