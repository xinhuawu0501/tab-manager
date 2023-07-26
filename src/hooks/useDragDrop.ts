import { useContext } from "react";
import { ITabItem } from "../lib/type/Tab";
import { TabCtx } from "../context/TabContextProvider";

export type DragEventHandler = {
  //@ts-ignore
  handleDragStart: (e: DragEvent<HTMLLIElement>, item: ITabItem) => void;
  //@ts-ignore
  handleDrop: (e: DragEvent<HTMLLIElement>) => void;
};

//@ts-ignore
export const useDragDrop = () => {
  const { handleMoveTab } = useContext(TabCtx);
  //@ts-ignore
  const handleDragStart = (e: DragEvent<HTMLLIElement>, item: ITabItem) => {
    const transferredData = JSON.stringify(item);
    if (!transferredData) return;
    e.dataTransfer?.setData("text/plain", transferredData);
  };

  //@ts-ignore
  const handleDrop = async (e: DragEvent<HTMLLIElement>) => {
    const data = e.dataTransfer.getData("text/plain");
    const parsedData: ITabItem = JSON.parse(data);
    const { windowId, id, index } = parsedData.info;
    const droppedZoneWindowId = e.currentTarget.id;

    if (windowId !== Number(droppedZoneWindowId) && id) {
      const movedtab = await handleMoveTab(
        { index: -1, windowId: +droppedZoneWindowId },
        id
      );
      return movedtab;
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  return { handleDragStart, handleDragOver, handleDrop };
};
