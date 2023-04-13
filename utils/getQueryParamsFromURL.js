export default function getSearchParams(url) {
  const queries = url.split("?")[url.split("?").length - 1];
  const queryArray = queries.split("&");
  const searchParams = {};
  queryArray.forEach((element) => {
    const singleQueryArray = element.split("=");
    searchParams[singleQueryArray[0]] = singleQueryArray[1];
  });

  return searchParams;
}
