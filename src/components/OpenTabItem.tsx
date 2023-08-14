import { LegacyRef, forwardRef, useContext } from "react";
import { ITabItem } from "../lib/type/Tab";
import { renderHighlightedTitle } from "../lib/util/renderHighlighedTitle";
import classes from "../styles/Tab.module.css";
import {
  BookmarkedIcon,
  CloseIcon,
  DragIcon,
  UnBookmarkedIcon,
} from "./icons/TabIcons";
import { SearchCtx } from "../context/SearchContextProvider";

const OpenTab = (props: any, ref: LegacyRef<HTMLLIElement>) => {
  const { item } = props;
  const { title, url, favIconUrl, windowId } = item.info;
  const { query } = useContext(SearchCtx);

  return (
    <li
      {...props}
      id={String(windowId)}
      className={`${classes["tab-item"]}`}
      ref={ref}
    >
      <DragIcon />
      {favIconUrl ? (
        <img src={favIconUrl} alt={`${title}_img`} />
      ) : (
        <div className={classes["empty-img"]} />
      )}

      <div
        className={classes["title"]}
        onClick={() => {
          item.handleNavigateTo(url!);
        }}
      >
        {renderHighlightedTitle(item, query)}
      </div>

      <button
        className={classes["icon-container"]}
        onClick={() => item.handleClose()}
      >
        <CloseIcon />
      </button>

      <button
        className={classes["icon-container"]}
        onClick={() => item.handleToggleBookmark()}
      >
        {item.isBookmarked ? <BookmarkedIcon /> : <UnBookmarkedIcon />}
      </button>
    </li>
  );
};

export const OpenTabItem = forwardRef(OpenTab);