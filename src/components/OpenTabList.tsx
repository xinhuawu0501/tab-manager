import { useContext, useEffect, useMemo } from "react";
import { TabCtx } from "../context/TabContextProvider";
import { ITabItem } from "../lib/type/Tab";
import classes from "../styles/Tab.module.css";
import { ListItem } from "./ListItem";
import { SearchCtx } from "../context/SearchContextProvider";
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from "react-beautiful-dnd";

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
  const { ALL, window } = useContext(TabCtx);
  const { data, query } = useContext(SearchCtx);
  const { searchedAllTabs } = data;

  const allTabArrSortedByWindow = useMemo(() => {
    const groupedByWindow = handleGroupTabsByWindow(searchedAllTabs);
    const arr = Object.entries(groupedByWindow);

    if (!window || !window.id) return arr;
    const indexOfCurrentWindowGroup = arr.findIndex(
      ([k, v]) => Number(k) == window.id
    );
    if (indexOfCurrentWindowGroup === -1) return arr;

    const temp = arr[0];
    arr[0] = arr[indexOfCurrentWindowGroup];
    arr[indexOfCurrentWindowGroup] = temp;

    return arr;
  }, [ALL, searchedAllTabs, window]);

  useEffect(() => {
    resetServerContext();
  }, []);

  return (
    <div id="all-tabs">
      <label>{`ALL (${searchedAllTabs.length})`}</label>
      <DragDropContext onDragEnd={() => {}}>
        {allTabArrSortedByWindow.map(([windowId, tabs]) => {
          return (
            <Droppable droppableId={windowId} key={windowId}>
              {(provided) => {
                const { droppableProps, innerRef } = provided;
                return (
                  <ul
                    className={classes["tab-group"]}
                    id={windowId}
                    {...droppableProps}
                    ref={innerRef}
                  >
                    {tabs.map((t, i) => (
                      <Draggable draggableId={t.info.id! + ""} index={i}>
                        {(provided) => {
                          const { dragHandleProps, draggableProps } = provided;
                          return (
                            <ListItem
                              {...dragHandleProps}
                              {...draggableProps}
                              key={t.info.id}
                              item={t}
                              category="ALL"
                              query={query}
                            />
                          );
                        }}
                      </Draggable>
                    ))}
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
