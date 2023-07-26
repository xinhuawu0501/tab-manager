import { ListItem } from "./ListItem";
import classes from "../styles/Tab.module.css";
import { ITabItem } from "../lib/type/Tab";
import { useContext, useMemo } from "react";
import { useSearchTab } from "../hooks/useSearchTab";
import { useDragDrop } from "../hooks/useDragDrop";
import { TabCtx } from "../context/TabContextProvider";

export const handleGroupTabsByWindow = (tabs: ITabItem[]) => {
  const groups: { [id: number]: ITabItem[] } = {};

  for (const tab of tabs) {
    const { windowId } = tab.info;
    groups[windowId] ||= [];
    groups[windowId].push(tab);
  }

  return groups;
};

export const List = () => {
  const { ALL, window: currentWindow } = useContext(TabCtx);

  const {
    renderSearchInputField,
    deferredQuery,
    searchedAllTabs,
    searchedBookmarkedTabs,
  } = useSearchTab();

  const { handleDragStart, handleDrop } = useDragDrop();

  const allTabArrSortedByWindow = useMemo(() => {
    const groupedByWindow = handleGroupTabsByWindow(searchedAllTabs);
    const arr = Object.entries(groupedByWindow);

    if (!currentWindow || !currentWindow.id) return arr;
    const indexOfCurrentWindowGroup = arr.findIndex(
      ([k, v]) => Number(k) == currentWindow.id
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
      {renderSearchInputField()}

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
