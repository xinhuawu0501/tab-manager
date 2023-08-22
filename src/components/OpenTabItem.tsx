import { LegacyRef, forwardRef, useContext } from "react";
import { renderHighlightedTitle } from "../lib/util/renderHighlighedTitle";
import classes from "../styles/Tab.module.css";
import {
  BookmarkedIcon,
  CloseIcon,
  DragIcon,
  UnBookmarkedIcon,
} from "./icons/TabIcons";
import { SearchCtx } from "../context/SearchContextProvider";
import { ITabItem } from "../lib/type/Tab";

const OpenTab = (props: { item: ITabItem }, ref: LegacyRef<HTMLLIElement>) => {
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

      <div className={classes["adornment"]}>
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
      </div>
    </li>
  );
};

export const OpenTabItem = forwardRef(OpenTab);
