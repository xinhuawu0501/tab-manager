import { List } from "../components/List";
import { SearchContextProvider } from "../context/SearchContextProvider";
import { TabContextProvider } from "../context/TabContextProvider";
import "../styles/global.css";

export default function Home() {
  return (
    <TabContextProvider>
      <SearchContextProvider>
        <List />
      </SearchContextProvider>
    </TabContextProvider>
  );
}
