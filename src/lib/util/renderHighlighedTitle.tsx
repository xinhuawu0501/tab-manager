import { ITabItem } from "../type/Tab";

export const renderHighlightedTitle = (item: ITabItem, query: string) => {
  const { searchedIndexes, info } = item;
  const { title } = info;

  const queryLength = query.length;
  if (!searchedIndexes || searchedIndexes.length == 0 || queryLength === 0)
    return title;

  //split title string into chunks
  const subStrs = [];
  let p1 = 0;
  for (let i = 0; i < searchedIndexes.length; i++) {
    subStrs.push(title?.slice(p1, searchedIndexes[i]));

    const highLightedStr = title?.slice(
      searchedIndexes[i],
      searchedIndexes[i] + queryLength
    );

    subStrs.push(highLightedStr);
    p1 = searchedIndexes[i] + queryLength;
    if (i == searchedIndexes.length - 1) subStrs.push(title?.slice(p1));
  }
  return (
    <div>
      {subStrs.map((str, i) =>
        i % 2 == 0 ? <span key={i}>{str}</span> : <mark key={i}>{str}</mark>
      )}
    </div>
  );
};
