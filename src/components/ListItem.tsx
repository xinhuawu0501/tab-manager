import { BookmarkedIcon, CloseIcon, UnBookmarkedIcon } from "./icons/TabIcons";
import classes from "../styles/Tab.module.css";
import { Catogories, ITabItem } from "../lib/type/Tab";

export const ListItem = ({
  item,
  category,
  handleOpenNewTab,
  query,
}: {
  item: ITabItem;
  category: Catogories;
  handleOpenNewTab: Function;
  query: string;
}) => {
  const { title, url, favIconUrl } = item.info;

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
    <li className={classes["tab-item"]}>
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
