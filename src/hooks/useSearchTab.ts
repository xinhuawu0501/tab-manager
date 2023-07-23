import { useDeferredValue, useState } from "react";
import { ITabItem } from "../lib/type/Tab";

export const useSearchTab = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

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

  return { handleSearch, setQuery, query, deferredQuery };
};
