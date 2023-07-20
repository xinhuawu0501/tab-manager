import { useTabs } from "../hooks/useTabs";
import { ListItem } from "./ListItem";
import classes from "../styles/Tab.module.css";
import { Catogories, ITabItem } from "../lib/type/Tab";
import { useMemo } from "react";

export const List = () => {
  const { tabs, handleOpenNewTab, currentWindow } = useTabs();
  const { ALL, BOOKMARKED } = tabs;

  //TODO: place the current window on the first of the array
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
    const groupedByWindow = handleGroupTabsByWindow(ALL);
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
  }, [ALL.length, currentWindow]);

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
      <div id="all-tabs">
        <label>{`ALL (${ALL.length})`}</label>
        {allTabArrSortedByWindow.map(([key, value]) =>
          renderTabs(value, "ALL")
        )}
      </div>
      <div id="bookmarked-tabs">
        <label>{`BOOKMARKED (${BOOKMARKED.length})`}</label>
        {renderTabs(BOOKMARKED, "BOOKMARKED")}
      </div>
    </div>
  );
};
