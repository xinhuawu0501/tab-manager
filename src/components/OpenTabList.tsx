import { useContext, useEffect, useMemo } from "react";
import { TabCtx } from "../context/TabContextProvider";
import { DragData, ITabItem, MoveProperties } from "../lib/type/Tab";
import classes from "../styles/Tab.module.css";
import { SearchCtx } from "../context/SearchContextProvider";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
  resetServerContext,
} from "react-beautiful-dnd";
import { OpenTabItem } from "./OpenTabItem";

const handleGroupTabsByWindow = (tabs: ITabItem[]) => {
  const groups: { [id: number]: ITabItem[] } = {};

  for (const tab of tabs) {
    const { windowId } = tab.info;
    groups[windowId] ||= [];
    groups[windowId].push(tab);
  }

  return groups;
};

export const OpenTabList = () => {
  const { window, ALL } = useContext(TabCtx);
  const { data } = useContext(SearchCtx);
  const { searchedAllTabs } = data;

  const tabsGroupByWindow = useMemo(
    () => handleGroupTabsByWindow(searchedAllTabs),
    [searchedAllTabs]
  );

  const allTabArrSortedByWindow = useMemo(() => {
    const arr = Object.entries(tabsGroupByWindow);

    if (!window || !window.id) return arr;
    const indexOfCurrentWindowGroup = arr.findIndex(
      ([k, v]) => Number(k) == window.id
    );
    if (indexOfCurrentWindowGroup === -1) return arr;

    const temp = arr[0];
    arr[0] = arr[indexOfCurrentWindowGroup];
    arr[indexOfCurrentWindowGroup] = temp;

    return arr;
  }, [tabsGroupByWindow, window]);

  useEffect(() => {
    resetServerContext();
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const windowIsChange = source.droppableId !== destination.droppableId;
    const indexIsChange = source.index !== destination.index;
    if (!windowIsChange && !indexIsChange) return;

    const draggingTab = tabsGroupByWindow[+source.droppableId].at(source.index);
    if (!draggingTab?.info.id) return;

    const tabAtDestination = tabsGroupByWindow[+source.droppableId].at(
      destination.index
    );

    const dragData: DragData = {
      source: ALL.findIndex((t) => t.info.id === draggingTab.info.id),
      destination: ALL.findIndex(
        (t) => t.info.id === tabAtDestination?.info.id
      ),
      indexInGroup: destination.index,
    };

    if (windowIsChange) dragData.windowId = Number(destination.droppableId);
    draggingTab.handleMoveTab(dragData);
  };

  return (
    <div id="all-tabs">
      <label>{`ALL (${searchedAllTabs.length})`}</label>
      <DragDropContext onDragEnd={handleDragEnd}>
        {allTabArrSortedByWindow.map(([windowId, tabs]) => {
          return (
            <Droppable droppableId={windowId} key={windowId}>
              {(provided) => {
                const { droppableProps, innerRef, placeholder } = provided;
                return (
                  <ul
                    className={classes["tab-group"]}
                    id={windowId}
                    {...droppableProps}
                    ref={innerRef}
                  >
                    {tabs.map((t, i) => (
                      <Draggable
                        draggableId={t.info.id! + ""}
                        index={i}
                        key={i}
                      >
                        {(provided) => {
                          const { dragHandleProps, draggableProps, innerRef } =
                            provided;
                          return (
                            <OpenTabItem
                              {...dragHandleProps}
                              {...draggableProps}
                              key={t.info.id}
                              item={t}
                              ref={innerRef}
                            />
                          );
                        }}
                      </Draggable>
                    ))}
                    {placeholder}
                  </ul>
                );
              }}
            </Droppable>
          );
        })}
      </DragDropContext>
    </div>
  );
};
