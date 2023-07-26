import { BookmarkedIcon, CloseIcon, UnBookmarkedIcon } from "./icons/TabIcons";
import classes from "../styles/Tab.module.css";
import { Catogories, ITabItem } from "../lib/type/Tab";
import { DragEventHandler } from "../hooks/useDragDrop";

export const ListItem = ({
  item,
  category,
  handleOpenNewTab,
  query,
  handleDragStart,
  handleDrop,
}: {
  item: ITabItem;
  category: Catogories;
  handleOpenNewTab: Function;
  handleDragStart?: DragEventHandler["handleDragStart"];
  handleDrop?: DragEventHandler["handleDrop"];

  query: string;
}) => {
  const { title, url, favIconUrl, windowId } = item.info;

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
      className={classes["tab-item"]}
      draggable={category === "ALL"}
      onDragStart={(e) => {
        if (category !== "ALL") return;
        handleDragStart!(e, item);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        if (category !== "ALL") return;
        handleDrop!(e);
      }}
    >
      {favIconUrl ? (
        <img src={favIconUrl} alt={`${title}_img`} />
      ) : (
        <div className={classes["empty-img"]} />
      )}

      <div
        className={classes["title"]}
        onClick={() => {
          item
            .handleNavigateTo()
            .then((res) => {
              if (!res || res.find((t) => t.status === "rejected"))
                return Promise.reject();
            })
            .then(
              (res) => {},
              (rej) => handleOpenNewTab(url)
            )
            .catch((err) => console.error(err));
        }}
      >
        {renderHighlightedTitle()}
      </div>

      {category === "ALL" && (
        <button onClick={() => item.handleClose()}>
          <CloseIcon />
        </button>
      )}

      <button onClick={() => item.handleToggleBookmark()}>
        {item.isBookmarked ? <BookmarkedIcon /> : <UnBookmarkedIcon />}
      </button>
    </li>
  );
};
