import {
  BookmarkedIcon,
  CloseIcon,
  OpenLinkIcon,
  UnBookmarkedIcon,
} from "./icons/TabIcons";
import classes from "../styles/Tab.module.css";
import { Catogories, ITabItem } from "../lib/type/Tab";
import { DragEventHandler } from "../hooks/useDragDrop";
import { useContext } from "react";
import { TabCtx } from "../context/TabContextProvider";
import { renderHighlightedTitle } from "../lib/util/renderHighlighedTitle";
import { OpenTabItem } from "./OpenTabItem";

interface TabItemProps {
  item: ITabItem;
  query: string;
  category?: Catogories;
  handleDragStart?: DragEventHandler["handleDragStart"];
  handleDrop?: DragEventHandler["handleDrop"];
}

const BookmarkedTab = ({ item, query }: TabItemProps) => {
  const { title, url, favIconUrl, windowId, id } = item.info;
  const { ALL } = useContext(TabCtx);

  const tabIsClosed = ALL.find((t) => t.info.id === id) == null;

  return (
    <li
      id={String(windowId)}
      className={`${classes["tab-item"]} ${tabIsClosed && classes["close"]}`}
    >
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

      {tabIsClosed ? (
        <a
          className={classes["icon-container"]}
          href={url}
          target="_blank"
          rel="noopenner noreferrer"
        >
          <OpenLinkIcon />
        </a>
      ) : (
        <button
          className={classes["icon-container"]}
          onClick={() => item.handleClose()}
        >
          <CloseIcon />
        </button>
      )}

      <button
        className={classes["icon-container"]}
        onClick={() => item.handleToggleBookmark()}
      >
        {item.isBookmarked ? <BookmarkedIcon /> : <UnBookmarkedIcon />}
      </button>
    </li>
  );
};

export const ListItem = ({ item, category, query }: TabItemProps) => {
  return category === "ALL" ? (
    <OpenTabItem item={item} />
  ) : (
    <BookmarkedTab item={item} query={query} />
  );
};
