const REPLACEMENT_RULES = {
    python: "python3",
    pyqt: "pyqt5",
}

function replaceAll(str, mapObj) {
    var re = new RegExp('\\b(' + Object.keys(REPLACEMENT_RULES).join("|") + ')\\b', "gi");

    return str.replace(re, function (matched) {
        return mapObj[matched.toLowerCase()];
    });
}

// chrome.runtime.onInstalled.addListener(function () {
//     chrome.storage.sync.set({ replacementRules: REPLACEMENT_RULES }, function () {
//         console.log("Extension loaded");
//     });
// });

// https://developer.chrome.com/extensions/webRequest
// https://googlechrome.github.io/samples/urlsearchparams/
// https://www.jackfranklin.co.uk/blog/url-search-params/
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.method === 'GET') {
            if (details.url.indexOf('google.com/search?') != -1) {
                var url = new URL(details.url);
                var searchParams = new URLSearchParams(url.search);
                var searchKeywords = searchParams.get('q');
                var updatedKeywords = replaceAll(searchKeywords, REPLACEMENT_RULES);
                if (searchKeywords != updatedKeywords) {
                    searchParams.set('q', updatedKeywords);
                    url.search = searchParams;
                    return { redirectUrl: url.toString() };
                } else {
                    return {};
                }
            }
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]);