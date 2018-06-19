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
| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| key | `string` | __(required)__ | [Bing Image Search API](https://azure.microsoft.com/en-us/services/cognitive-services/bing-image-search-api/) Subscription Key |
| query | `string` | __(required)__ | Search [query](https://msdn.microsoft.com/library/ff795620.aspx) |
| amount | `integer` | 2000 | Desired count of results |
| market | `string` | | [*Market Code*](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#market-codes) of request origin (e.g., `en-US`) |
| safeSearch | `string` | `Moderate` | [Filter adult content](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#safesearch) (`Off`, `Moderate`, ``Strict``) |
| offset | `integer` | `0` | [Offset](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#offset) of the initial API call |
| count | `integer` | `150` | [Count](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#count) of results per API call (lower this value may result in more API calls) |
| fetchCb | `function` | [`fetch`](https://github.com/bitinn/node-fetch) | Callback to construct a request that returns a response promise |

## Features

- Turns a search query into an async iterator of search API call response objects
- Ends iterator _when requested amount is reached_ or _when there are no more results_
- [Avoids results overlap](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#offset) by specifying the [`offset`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#offset) API parameter with previous response's [`nextOffset`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#nextoffset) value
- Fills in [`X-MSEdge-ClientID`](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#clientid) automatically based on previous API responses

## License
MIT
