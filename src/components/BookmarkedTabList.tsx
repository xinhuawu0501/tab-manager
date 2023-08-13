import { useContext } from "react";
import { ITabItem } from "../lib/type/Tab";
import classes from "../styles/Tab.module.css";
import { ListItem } from "./ListItem";
import { SearchCtx } from "../context/SearchContextProvider";

export const BookmarkedTabList = () => {
  const { query, data } = useContext(SearchCtx);
  const { searchedBookmarkedTabs } = data;
  const renderBookmarkedTabs = (tabs: ITabItem[]) => {
    return (
      <ul className={classes["tab-group"]}>
        {tabs.map((t) => (
          <ListItem
            key={t.info.id}
            item={t}
            category="BOOKMARKED"
            query={query}
          />
        ))}
      </ul>
    );
  };

  return (
    <div id="bookmarked-tabs">
      <label>{`BOOKMARKED (${searchedBookmarkedTabs.length})`}</label>
      {renderBookmarkedTabs(searchedBookmarkedTabs)}
    </div>
  );
};
