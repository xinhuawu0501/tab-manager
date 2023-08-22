import { Catogories, ITabItem } from "../lib/type/Tab";
import { BookmarkedTabItem } from "./BookmarkedTabItem";
import { OpenTabItem } from "./OpenTabItem";

export interface TabItemProps {
  item: ITabItem;
  category?: Catogories;
}

export const ListItem = ({ item, category }: TabItemProps) => {
  return category === "ALL" ? (
    <OpenTabItem item={item} />
  ) : (
    <BookmarkedTabItem item={item} />
  );
};
