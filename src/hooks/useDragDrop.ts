import React, { useContext } from "react";
import { ITabItem } from "../lib/type/Tab";
import { TabCtx } from "../context/TabContextProvider";

export type DragEventHandler = {
  handleDragStart: (e: React.DragEvent<HTMLLIElement>, item: ITabItem) => void;
  handleDrop: (e: React.DragEvent<HTMLLIElement>) => void;
};

export const useDragDrop = () => {
  const { handleMoveTab, ALL } = useContext(TabCtx);

  const handleDragStart = (
    e: React.DragEvent<HTMLLIElement>,
    item: ITabItem
  ) => {
    const transferredData = JSON.stringify(item);
    if (!transferredData) return;
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("text/plain", transferredData);
  };

  const handleDrop = async (e: React.DragEvent<HTMLLIElement>) => {
    const data = e.dataTransfer.getData("text/plain");
    const parsedData: ITabItem = JSON.parse(data);
    const { windowId, id } = parsedData.info;
    const droppedZoneWindowId = e.currentTarget.id;

    if (windowId !== Number(droppedZoneWindowId) && id) {
      await handleMoveTab({ index: -1, windowId: +droppedZoneWindowId }, id);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  return { handleDragStart, handleDragOver, handleDrop };
};
