import { useTabs } from "../hooks/useTabs";
import { ListItem } from "./ListItem";
import classes from "../styles/Tab.module.css";

export const List = () => {
  const { tabState, dispatch } = useTabs();
  console.log("in list", tabState);

  return (
    <ul className={classes["tab-list"]}>
      {tabState.ALL.map((l, i) => (
        <ListItem key={i} item={l} dispatch={dispatch} />
      ))}
    </ul>
  );
};