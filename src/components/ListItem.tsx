import {
  BookmarkedIcon,
  CloseIcon,
  DragIcon,
  OpenLinkIcon,
  UnBookmarkedIcon,
} from "./icons/TabIcons";
import classes from "../styles/Tab.module.css";
import { Catogories, ITabItem } from "../lib/type/Tab";
import { DragEventHandler } from "../hooks/useDragDrop";
import { useContext } from "react";
import { TabCtx } from "../context/TabContextProvider";

interface TabItemProps {
  item: ITabItem;
  category?: Catogories;
  query: string;
  handleDragStart?: DragEventHandler["handleDragStart"];
  handleDrop?: DragEventHandler["handleDrop"];
}

const renderHighlightedTitle = (item: ITabItem, query: string) => {
  const { searchedIndexes, info } = item;
  const { title } = info;

  const queryLength = query.length;
  if (!searchedIndexes || searchedIndexes.length == 0 || queryLength === 0)
    return title;

  //split title string into chunks
  const subStrs = [];
  let p1 = 0;
  for (let i = 0; i < searchedIndexes.length; i++) {
    subStrs.push(title?.slice(p1, searchedIndexes[i]));

    const highLightedStr = title?.slice(
      searchedIndexes[i],
      searchedIndexes[i] + queryLength
    );

    subStrs.push(highLightedStr);
    p1 = searchedIndexes[i] + queryLength;
    if (i == searchedIndexes.length - 1) subStrs.push(title?.slice(p1));
  }
  return (
    <div>
      {subStrs.map((str, i) =>
        i % 2 == 0 ? <span key={i}>{str}</span> : <mark key={i}>{str}</mark>
      )}
    </div>
  );
};

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

const Tab = ({ item, query, handleDragStart, handleDrop }: TabItemProps) => {
  const { title, url, favIconUrl, windowId } = item.info;

  return (
    <li
      id={String(windowId)}
      className={`${classes["tab-item"]}`}
      draggable={true}
      onDragStart={(e) => {
        handleDragStart!(e, item);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        handleDrop!(e);
      }}
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

export const ListItem = ({
  item,
  category,
  query,
  handleDragStart,
  handleDrop,
}: TabItemProps) => {
  return category === "ALL" ? (
    <Tab
      item={item}
      query={query}
      handleDragStart={handleDragStart}
      handleDrop={handleDrop}
    />
  ) : (
    <BookmarkedTab item={item} query={query} />
  );
};
