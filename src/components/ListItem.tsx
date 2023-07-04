import { Dispatch } from "react";
import { TabAction, TabActionType, TabItem } from "../hooks/useTabs";
import { CloseIcon } from "./icons/close-tab";
import Image from "next/image";
import classes from "../styles/Tab.module.css";

export const ListItem = ({
  item,
  dispatch,
}: {
  item: TabItem;
  dispatch: Dispatch<TabAction>;
}) => {
  const { title, url, favIconUrl, id } = item.info;

  return (
    <li className={classes["tab-item"]}>
      {favIconUrl ? (
        <img src={favIconUrl} alt={`${title}_img`} />
      ) : (
        <div className={classes["empty-img"]}></div>
      )}
      <a href={url} target="_blank" rel="noopener noreferrer">
        {title && title?.length > 30 ? title.slice(0, 30) + "..." : title}
      </a>
      <button
        onClick={() => dispatch({ type: TabActionType.CLOSE, payload: [item] })}
      >
        <CloseIcon />
      </button>
    </li>
  );
};
