import { BookmarkedIcon, CloseIcon, UnBookmarkedIcon } from "./icons/close-tab";
import classes from "../styles/Tab.module.css";
import { Catogories, ITabItem } from "../lib/type/Tab";

export const ListItem = ({
  item,
  category,
}: {
  item: ITabItem;
  category: Catogories;
}) => {
  const { title, url, favIconUrl } = item.info;

  return (
    <li className={classes["tab-item"]} onClick={() => item.handleNavigateTo()}>
      {favIconUrl ? (
        <img src={favIconUrl} alt={`${title}_img`} />
      ) : (
        <div className={classes["empty-img"]} />
      )}

      <div className={classes["title"]}>{title}</div>

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
