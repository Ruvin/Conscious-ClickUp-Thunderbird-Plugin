/**********************************************************************
 * Portions written by (C) Ruvin Roshan,
 * Conscious Solutions Ltd.
 * 
 * This file is part of the Conscious Solutions ClickUp Thunderbird Plugin.
 *
 * The Conscious Solutions ClickUp Thunderbird Plugin
 * is Freeware:you can redistribute it and use for free.
 *
 * The Conscious Solutions ClickUp Thunderbird Plugin
 * is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *********************************************************************/
 
function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();

  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: true});
    // Just change any instance of Example in the HTTP response
    // to WebExtension Example.
    str = str.replace(/Example/g, 'WebExtension Example');
    filter.write(encoder.encode(str));
    filter.disconnect();
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["https://api.clickup.com/*"], types: ["main_frame"]},
  ["blocking"]
);


