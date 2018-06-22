# Bing Image Search Async Iterator
Query Bing Image Search API ([v7](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference)) and get an async iterator of response objects.

## Motivation
[Bing Image Search API](https://azure.microsoft.com/en-us/services/cognitive-services/bing-image-search-api/) returns up to [150](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#count) results per API call. To access more results, you need to specify the proper [`offset`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#offset) request parameter in a subsequent API call. This module automates the process of filling the [`offset`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#offset) parameter value and determines when to stop making API calls— what you get in the end is a async iterator of parsed responses.

## Response objects
Please note that response objects wrap search results in the [`value`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#images-value) field.

```JS
{
  _type: 'Images',
  totalEstimatedMatches: 834,
  nextOffset: 195,
  value: [
    {
      name: ...,
      thumbnailUrl: ...,
      datePublished: ...,
      contentUrl: ...,
      ...
    },
    ...
  ],
  ...
}
```

This module doesn't unwrap search results for you because response objects may contain additional metadata (e.g., [`queryExpansions`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#queryexpansions), [`pivotSuggestions`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#pivotsuggestions), [`similarTerms`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#similarterms) and [`relatedSearches`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#caption-relatedsearches)).

## Installation
```
npm install --save bing-image-search-async-iterator
```

## Example Usage

This example prints out unwrapped search results returned from the API calls.

```js
const search = require('bing-image-search-async-iterator');

(async () => {
  const responses = search({
    key:'<YOUR_BING_IMAGE_SEARCH_API_SUBSRIPTION_KEY>',
    query: 'kittens',
    amount: 151,
  })
  for await (const response of responses) {
    for (const result of response.value) {
      console.log(result);
    }
  }
})();
```

## Options

### Basic Options
These are the main parameters you should specify.

| Parameter    | Type       | Default        | Description                                                        |
| ------------ | ---------- | -------------- | ------------------------------------------------------------------ |
| key          | `string`   |                | **(Required)** [Bing Image Search API](https://azure.microsoft.com/en-us/services/cognitive-services/bing-image-search-api/) Subscription Key |
| query        | `string`   |                | **(Required)** Search [query](https://msdn.microsoft.com/library/ff795620.aspx) |
| amount       | `integer`  | `2000`         | Desired count of results |
| market       | `string`   |                | [*Market Code*](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#market-codes) of request origin (e.g., `en-US`) |
| safeSearch   | `string`   | `Moderate`     | [Filter adult content](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#safesearch) (`Off`, `Moderate`, ``Strict``) |

### Filtering Options
You may specify your search query's filters with the following settings.

| Parameter    | Type       | Default        | Description                                                        |
| ------------ | ---------- | -------------- | ------------------------------------------------------------------ |
| aspect       | `string`   | `All`          | Filter images by aspect ratio (`Square`, `Wide`, `Tall`, `All`) |
| color        | `string`   |                | Filter images by color (`ColorOnly`, `Monochrome`, `Black`, `Blue`, `Brown`, `Gray`, `Green`, `Orange`, `Pink`, `Purple`, `Red`, `Teal`, `White`, `Yellow`) |
| imageContent | `string`   |                | Filter images by content type (`Face`, `Portrait`) |
| imageType    | `string`   |                | Filter images by image type (`AnimatedGif`, `AnimatedGifHttps`, `Clipart`, `Line`, `Photo`, `Shopping`, `Transparent`) |
| license      | `string`   | `All`          | Filter images by image license type (`Any`, `Public`, `Share`, `ShareCommercially`, `Modify`, `ModifyCommercially`, `All`); `Any` excludes images without known license |
| freshness    | `string`   |                | Filter images by discovery time (`Day`, `Week`, `Month`) |
| size         | `string`   | `All`          | Filter images by image size (`Small`, `Medium`, `Large`, `Wallpaper`, `All`) |
| width        | `integer`  |                | Filter images by specific width |
| height       | `integer`  |                | Filter images by specific height |
| minWidth     | `integer`  |                | Filter images by where width is greater than or equal to specified value |
| minHeight    | `integer`  |                | Filter images by where height is greater than or equal to specified value |
| maxWidth     | `integer`  |                | Filter images by where width is less than or equal to specified value |
| maxHeight    | `integer`  |                | Filter images by where height is less than or equal to specified value |
| minFileSize  | `integer`  |                | Filter images by where file size is greater than or equal to specifie value |
| maxFileSize  | `integer`  |                | Filter images by where file size is less than or equal to specified value |

### Advanced Options
You do not need to set these parameters under normal circumstances.

| Parameter    | Type       | Default        | Description                                                        |
| ------------ | ---------- | -------------- | ------------------------------------------------------------------ |
| offset       | `integer`  | `0`            | [Offset](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#offset) of the initial API call |
| count        | `integer`  | `150`          | [Count](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#count) of results per API call (lower this value may result in more API calls) |
| clientID     | `string`   |                | API request header [`X-MSEdge-ClientID`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#clientid) (auto-determined if not set) |
| clientIP     | `string`   |                | API request header [`X-MSEdge-ClientIP`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#clientip) |
| location     | `string`   |                | API request header [`X-Search-Location`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#location) |
| queryParams  | `object`   |                | Additional query params (e.g., `{ imageType: "AnimatedGif" }`) |
| headerParams | `object`   |                | Additional header params (e.g., `{ Pragma: "no-cache" }`) |
| fetchCb      | `function` | [`fetch`](https://github.com/bitinn/node-fetch) | Callback to construct a request that returns a response promise |

## Features

- Turns a search query into an async iterator of search API call response objects
- Ends iterator _when requested amount is reached_ or _when there are no more results_
- [Avoids results overlap](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#offset) by specifying the [`offset`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#offset) API parameter with previous response's [`nextOffset`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#nextoffset) value
- Fills in [`X-MSEdge-ClientID`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#clientid) automatically based on previous API responses

## License
MIT
