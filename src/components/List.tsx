import classes from "../styles/Tab.module.css";
import { OpenTabList } from "./OpenTabList";
import { BookmarkedTabList } from "./BookmarkedTabList";
import { useContext } from "react";
import { SearchCtx } from "../context/SearchContextProvider";

export const List = () => {
  const { renderSearchInputField } = useContext(SearchCtx);

  return (
    <div className={classes["tab-list"]}>
      {renderSearchInputField()}

      <OpenTabList />
      <BookmarkedTabList />
    </div>
  );
};
