import { useTabs } from "../hooks/useTabs";
import { ListItem } from "./ListItem";
import classes from "../styles/Tab.module.css";
import { Catogories, TabListState } from "../lib/type/Tab";

export const List = () => {
  const { tabs } = useTabs();

  const renderTabs = (tabs: TabListState) => {
    return Object.entries(tabs).map(([key, value]) => {
      return (
        <div key={key}>
          <label>{`${key}(${value.length})`}</label>
          {value.map((v) => (
            <ListItem key={v.info.id} item={v} category={key as Catogories} />
          ))}
        </div>
      );
    });
  };

  return <ul className={classes["tab-list"]}>{renderTabs(tabs)}</ul>;
};
