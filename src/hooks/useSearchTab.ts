import { useDeferredValue, useState } from "react";
import { ITabItem } from "../lib/type/Tab";

export const useSearchTab = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const handleSearch = (tabItems: ITabItem[]) => {
    if (!query) return tabItems;

    const queryRegex = new RegExp(deferredQuery);

    return tabItems.filter(
      (t) =>
        t.info.title?.search(queryRegex) !== -1 ||
        t.info.url?.search(queryRegex) !== -1
    );
  };

  return { handleSearch, setQuery, query, deferredQuery };
};
