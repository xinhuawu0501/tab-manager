import { Dispatch } from "react";
import { TabAction, TabActionType, TabItem } from "../hooks/useTabs";
import { CloseIcon } from "./icons/close-tab";
import Image from "next/image";

export const ListItem = ({
  item,
  dispatch,
}: {
  item: TabItem;
  dispatch: Dispatch<TabAction>;
}) => {
  const { title, url, favIconUrl, id } = item.info;
  console.log(item, "item");

  return (
    <li>
      <img src={favIconUrl!} alt={`${title}_img`} />
      <a href={url} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
      <button
        onClick={() => dispatch({ type: TabActionType.CLOSE, payload: [item] })}
      >
        <CloseIcon />
      </button>
    </li>
  );
};
