import { Tab, useTabs } from "../hooks/useTabs";
import { ListItem } from "./ListItem";

export const List = () => {
  const { tabState, dispatch } = useTabs();
  console.log("in list", tabState, tabState[0]);

  return (
    <ul>
      {tabState.map((l, i) => (
        <ListItem key={i} item={l} dispatch={dispatch} />
      ))}
    </ul>
  );
};
