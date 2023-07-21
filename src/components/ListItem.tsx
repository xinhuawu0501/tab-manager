import { BookmarkedIcon, CloseIcon, UnBookmarkedIcon } from "./icons/TabIcons";
import classes from "../styles/Tab.module.css";
import { Catogories, ITabItem } from "../lib/type/Tab";

export const ListItem = ({
  item,
  category,
  handleOpenNewTab,
}: {
  item: ITabItem;
  category: Catogories;
  handleOpenNewTab: Function;
}) => {
  const { title, url, favIconUrl } = item.info;

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
        {title}
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
