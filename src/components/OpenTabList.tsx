import { useContext, useMemo } from "react";
import { TabCtx } from "../context/TabContextProvider";
import { ITabItem } from "../lib/type/Tab";
import classes from "../styles/Tab.module.css";
import { ListItem } from "./ListItem";
import { SearchCtx } from "../context/SearchContextProvider";

const handleGroupTabsByWindow = (tabs: ITabItem[]) => {
  const groups: { [id: number]: ITabItem[] } = {};

  for (const tab of tabs) {
    const { windowId } = tab.info;
    groups[windowId] ||= [];
    groups[windowId].push(tab);
  }

  return groups;
};

export const OpenTabList = () => {
  const { ALL, window } = useContext(TabCtx);
  const { data, query } = useContext(SearchCtx);

  const { searchedAllTabs } = data;

  const allTabArrSortedByWindow = useMemo(() => {
    const groupedByWindow = handleGroupTabsByWindow(searchedAllTabs);
    const arr = Object.entries(groupedByWindow);

    if (!window || !window.id) return arr;
    const indexOfCurrentWindowGroup = arr.findIndex(
      ([k, v]) => Number(k) == window.id
    );
    if (indexOfCurrentWindowGroup === -1) return arr;

    const temp = arr[0];
    arr[0] = arr[indexOfCurrentWindowGroup];
    arr[indexOfCurrentWindowGroup] = temp;

    return arr;
  }, [ALL, searchedAllTabs, window]);

  const renderAllTabs = (tabs: ITabItem[], windowId: string) => {
    return (
      <ul className={classes["tab-group"]} id={windowId}>
        {tabs.map((t) => (
          <ListItem key={t.info.id} item={t} category="ALL" query={query} />
        ))}
      </ul>
    );
  };

  console.log(allTabArrSortedByWindow);

  return (
    <div id="all-tabs">
      <label>{`ALL (${searchedAllTabs.length})`}</label>
      {allTabArrSortedByWindow.map(([key, value]) => renderAllTabs(value, key))}
    </div>
  );
};
