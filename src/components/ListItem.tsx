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

export const ListItem = ({
  item,
  category,
  query,
  handleDragStart,
  handleDrop,
}: {
  item: ITabItem;
  category: Catogories;
  query: string;
  handleDragStart?: DragEventHandler["handleDragStart"];
  handleDrop?: DragEventHandler["handleDrop"];
}) => {
  const { title, url, favIconUrl, windowId, id } = item.info;
  const { ALL } = useContext(TabCtx);

  const isDraggable = category == "ALL";
  const tabIsClosed = ALL.find((t) => t.info.id === id) == null;

  const renderHighlightedTitle = () => {
    const { searchedIndexes } = item;
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

  return (
    <li
      id={String(windowId)}
      className={`${classes["tab-item"]} ${tabIsClosed && classes["close"]}`}
      draggable={isDraggable}
      onDragStart={(e) => {
        if (!isDraggable) return;
        handleDragStart!(e, item);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        if (!isDraggable) return;
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
          //@ts-expect-error
          item.handleNavigateTo(url);
        }}
      >
        {renderHighlightedTitle()}
      </div>

      {!tabIsClosed && (
        <button
          className={classes["icon-container"]}
          onClick={() => item.handleClose()}
        >
          <CloseIcon />
        </button>
      )}

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
        <></>
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
