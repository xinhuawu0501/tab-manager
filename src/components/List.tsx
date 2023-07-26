import { handleGroupTabsByWindow, useTabs } from "../hooks/useTabs";
import { ListItem } from "./ListItem";
import classes from "../styles/Tab.module.css";
import { ITabItem } from "../lib/type/Tab";
import { useMemo } from "react";
import { useSearchTab } from "../hooks/useSearchTab";
import { useDragDrop } from "../hooks/useDragDrop";

export const List = () => {
  const { allTab, tabs, handleOpenNewTab, currentWindow, handleMoveTab } =
    useTabs();
  const { handleSearch, query, setQuery, deferredQuery } = useSearchTab();
  const { ALL, BOOKMARKED } = tabs;
  const { handleDragStart, handleDrop } = useDragDrop(handleMoveTab);

  console.log("list", allTab);

  const searchedAllTabs = handleSearch(ALL);
  const searchedBookmarkedTabs = handleSearch(BOOKMARKED);

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
  }, [ALL, searchedAllTabs, currentWindow]);

  const renderBookmarkedTabs = (tabs: ITabItem[]) => {
    return (
      <ul className={classes["tab-group"]}>
        {tabs.map((t) => (
          <ListItem
            key={t.info.id}
            item={t}
            category="BOOKMARKED"
            handleOpenNewTab={handleOpenNewTab}
            query={deferredQuery}
          />
        ))}
      </ul>
    );
  };

  const renderAllTabs = (tabs: ITabItem[], windowId: string) => {
    return (
      <ul className={classes["tab-group"]} id={windowId}>
        {tabs.map((t) => (
          <ListItem
            key={t.info.id}
            item={t}
            category="ALL"
            handleOpenNewTab={handleOpenNewTab}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            query={deferredQuery}
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
          renderAllTabs(value, key)
        )}
      </div>
      <div id="bookmarked-tabs">
        <label>{`BOOKMARKED (${searchedBookmarkedTabs.length})`}</label>
        {renderBookmarkedTabs(searchedBookmarkedTabs)}
      </div>
    </div>
  );
};
