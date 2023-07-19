import { useTabs } from "../hooks/useTabs";
import { ListItem } from "./ListItem";
import classes from "../styles/Tab.module.css";
import { ITabItem, TabListState } from "../lib/type/Tab";
import { useMemo } from "react";

export const List = () => {
  const { tabs, handleOpenNewTab } = useTabs();
  console.log(tabs);

  const handleGroupTabsByWindow = (tabs: ITabItem[]) => {
    const groups: { [id: number]: ITabItem[] } = {};

    for (const tab of tabs) {
      const { windowId } = tab.info;
      groups[windowId] ||= [];
      groups[windowId].push(tab);
    }

    return groups;
  };

  const groupedTab = useMemo(() => {
    return handleGroupTabsByWindow(tabs.ALL);
  }, [tabs.ALL.length]);

  const handleRenderAllTab = () => {
    return Object.entries(groupedTab).map(([key, value], i) => {
      return (
        <div key={key} className={classes["tab-group"]}>
          {value.map((v) => (
            <ListItem
              key={v.info.id}
              item={v}
              category="ALL"
              handleOpenNewTab={handleOpenNewTab}
            />
          ))}
        </div>
      );
    });
  };

  const renderTabs = (tabs: TabListState) => {
    return Object.entries(tabs).map(([key, value]) => {
      if (!value) return <></>;
      return (
        <div key={key}>
          <label>{`${key}${`(${value.length})`}`}</label>
          <div>
            {key === "BOOKMARKED" && (
              <div className={classes["tab-group"]}>
                {value.map((v) => (
                  <ListItem
                    key={v.info.id}
                    item={v}
                    category="BOOKMARKED"
                    handleOpenNewTab={handleOpenNewTab}
                  />
                ))}
              </div>
            )}
            {key === "ALL" && handleRenderAllTab()}
          </div>
        </div>
      );
    });
  };

  return <ul className={classes["tab-list"]}>{renderTabs(tabs)}</ul>;
};
