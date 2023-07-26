import { useContext, useDeferredValue, useState } from "react";
import { ITabItem } from "../lib/type/Tab";
import { TabCtx } from "../context/TabContextProvider";

import classes from "../styles/Tab.module.css";

export const useSearchTab = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const { ALL, BOOKMARKED } = useContext(TabCtx);

  const handleSearch = (tabItems: ITabItem[]) => {
    if (!query) return tabItems;

    try {
      //TODO: if input is not alphabet or number, append `\`
      const queryRegex = new RegExp(deferredQuery, "ig");

      const matchedResult = tabItems.filter(
        (t) => t.info.title?.search(queryRegex) !== -1
      );

      matchedResult.forEach((t) => {
        const matched = t.info.title!.matchAll(queryRegex);
        const matchedIndex = Array.from(matched).map(
          (r) => r.index
        ) as number[];
        t.searchedIndexes = matchedIndex;
      });
      return matchedResult;
    } catch (error) {
      return tabItems;
    }
  };

  const searchedAllTabs = handleSearch(ALL);
  const searchedBookmarkedTabs = handleSearch(BOOKMARKED);

  const renderSearchInputField = () => {
    return (
      <input
        className={classes["searchbar"]}
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        placeholder="Search..."
      />
    );
  };

  return {
    handleSearch,
    renderSearchInputField,
    deferredQuery,
    searchedAllTabs,
    searchedBookmarkedTabs,
  };
};
