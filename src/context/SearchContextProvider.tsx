import { PropsWithChildren, createContext, useContext } from "react";
import { ITabItem } from "../lib/type/Tab";
import { useSearchTab } from "../hooks/useSearchTab";

interface SearchCtx {
  query: string;
  renderSearchInputField: () => JSX.Element;
  data: {
    searchedAllTabs: ITabItem[];
    searchedBookmarkedTabs: ITabItem[];
  };
}

export const SearchCtx = createContext<SearchCtx>({
  query: "",
  renderSearchInputField: () => <></>,
  data: {
    searchedAllTabs: [],
    searchedBookmarkedTabs: [],
  },
});

export const SearchContextProvider = ({ children }: PropsWithChildren) => {
  const {
    renderSearchInputField,
    deferredQuery,
    searchedAllTabs,
    searchedBookmarkedTabs,
  } = useSearchTab();

  const contextValue: SearchCtx = {
    query: deferredQuery,
    renderSearchInputField: renderSearchInputField,
    data: {
      searchedAllTabs: searchedAllTabs,
      searchedBookmarkedTabs: searchedBookmarkedTabs,
    },
  };

  return (
    <SearchCtx.Provider value={contextValue}>{children}</SearchCtx.Provider>
  );
};
