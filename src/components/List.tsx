import { useTabs } from "../hooks/useTabs";
import { ListItem } from "./ListItem";
import classes from "../styles/Tab.module.css";
import { Catogories, ITabItem } from "../lib/type/Tab";
import { useMemo } from "react";
import { useSearchTab } from "../hooks/useSearchTab";

export const List = () => {
  const { tabs, handleOpenNewTab, currentWindow } = useTabs();
  const { handleSearch, query, setQuery, deferredQuery } = useSearchTab();
  const { ALL, BOOKMARKED } = tabs;

  const searchedAllTabs = handleSearch(ALL);
  const searchedBookmarkedTabs = handleSearch(BOOKMARKED);

  const handleGroupTabsByWindow = (tabs: ITabItem[]) => {
    const groups: { [id: number]: ITabItem[] } = {};

    for (const tab of tabs) {
      const { windowId } = tab.info;
      groups[windowId] ||= [];
      groups[windowId].push(tab);
    }

    return groups;
  };

  const allTabArrSortedByWindow = useMemo(() => {
    const groupedByWindow = handleGroupTabsByWindow(searchedAllTabs);
    const arr = Object.entries(groupedByWindow);

    if (!currentWindow || !currentWindow.id) return arr;
    const indexOfCurrentWindowGroup = arr.findIndex(
      //@ts-expect-error
      ([k, v]) => k == currentWindow.id
    );
    if (indexOfCurrentWindowGroup === -1) return arr;

    const temp = arr[0];
    arr[0] = arr[indexOfCurrentWindowGroup];
    arr[indexOfCurrentWindowGroup] = temp;

    return arr;
  }, [searchedAllTabs.length, currentWindow]);

  const renderTabs = (tabs: ITabItem[], category: Catogories) => {
    return (
      <ul className={classes["tab-group"]}>
        {tabs.map((t) => (
          <ListItem
            key={t.info.id}
            item={t}
            category={category}
            handleOpenNewTab={handleOpenNewTab}
          />
        ))}
      </ul>
    );
  };

  return (
    <div className={classes["tab-list"]}>
      <input
        className={classes["searchbar"]}
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        placeholder="Search..."
      />

      <div id="all-tabs">
        <label>{`ALL (${searchedAllTabs.length})`}</label>
        {allTabArrSortedByWindow.map(([key, value]) =>
          renderTabs(value, "ALL")
        )}
      </div>
      <div id="bookmarked-tabs">
        <label>{`BOOKMARKED (${searchedBookmarkedTabs.length})`}</label>
        {renderTabs(searchedBookmarkedTabs, "BOOKMARKED")}
      </div>
    </div>
  );
};
