import { CloseIcon } from "./icons/close-tab";
import classes from "../styles/Tab.module.css";
import { ITabItem } from "../lib/type/Tab";

export const ListItem = ({ item }: { item: ITabItem }) => {
  const { title, url, favIconUrl, id } = item.info;

  return (
    <li className={classes["tab-item"]}>
      {favIconUrl ? (
        <img src={favIconUrl} alt={`${title}_img`} />
      ) : (
        <div className={classes["empty-img"]}></div>
      )}
      <a href={url} target="_blank" rel="noopener noreferrer">
        {title && title?.length > 20 ? title.slice(0, 20) + "..." : title}
      </a>
      <button onClick={() => item.handleClose()}>
        <CloseIcon />
      </button>
      <button onClick={() => item.handleBookmark()}>Bookmark</button>
    </li>
  );
};
