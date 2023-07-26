import { List } from "../components/List";
import { TabContextProvider } from "../context/TabContextProvider";
import "../styles/global.css";

export default function Home() {
  return (
    <TabContextProvider>
      <List />
    </TabContextProvider>
  );
}
