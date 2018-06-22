import fetch from 'cross-fetch';

const apiEndPoint = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search';
const defaults = {
  key: null,
  query: null,
  market: null,
  safeSearch: null,
  offset: 0,
  count: 150,
  amount: 2000,
  fetchCb: fetch,
};
const HEADERS = {
  API_KEY:      'Ocp-Apim-Subscription-Key',
  CLIENT_ID:    'X-MSEdge-ClientID',
  CLIENT_IP:    'X-MSEdge-ClientIP',
  LOCATION:     'X-Search-Location',
  ACCEPT:       'Accept',
};
const acceptHeaderValue = 'application/json';

function filterNulls(obj) {
  return Object.assign(
    ...Object
      .keys(obj)
      .filter(key => obj[key] != null)
      .map(key => ({ [key]: obj[key] })),
  );
}

function stringify(obj) {
  return Object.keys(obj)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&');
}

export default async function* search(options) {
  const {
    key,
    query,
    market,
    safeSearch,
    aspect,
    color,
    imageContent,
    imageType,
    license,
    freshness,
    size,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    minFileSize,
    maxFileSize,
    offset,
    count,
    amount,
    clientIP,
    location,
    queryParams,
    headerParams,
    fetchCb,
  } = Object.assign({ }, defaults, options);
  let currOffset = offset;
  let currAmount = amount;
  let available = currOffset + currAmount;
  let clientID = options.clientID;

  while (currOffset < Math.min(currOffset + currAmount, available)) {
    const requestParams = filterNulls({
      q: query,
      mkt: market,
      safeSearch,
      aspect,
      color,
      imageContent,
      imageType,
      license,
      freshness,
      size,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      minFileSize,
      maxFileSize,
      offset: currOffset,
      count: Math.min(count, Math.min(currOffset + currAmount, available) - currOffset),
      ...queryParams,
    });
    const requestHeaders = filterNulls({
      [HEADERS.API_KEY]:      key,
      [HEADERS.CLIENT_ID]:    clientID,
      [HEADERS.CLIENT_IP]:    clientIP,
      [HEADERS.LOCATION]:     location,
      [HEADERS.ACCEPT]:       acceptHeaderValue,
      ...headerParams,
    });
    const requestOptions = {
      method: 'GET',
      headers: requestHeaders,
    };
    const requestUrl = `${apiEndPoint}?${stringify(requestParams)}`;
    const response = await fetchCb(requestUrl, requestOptions);
    const { ok, status, statusText } = response;
    if (!ok) { throw new Error(`HTTP error ${status}: "${statusText}"`); }
    const body = await response.json();
    currOffset = body.nextOffset;
    currAmount -= body.value.length;
    available = body.totalEstimatedMatches;
    clientID = clientID === undefined ? response.headers.get(HEADERS.CLIENT_ID) : clientID;
    yield body;
  }
}
