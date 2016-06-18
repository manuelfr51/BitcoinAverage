var currency = 'MXN';
var color_up = [255, 0, 0, 255];
var color_down = [0, 255, 0, 255];
var api_url_base = 'https://api.bitso.com/v2/ticker';
var click_url_base = 'https://bitso.com/#';

function updateTicker() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', api_url_base, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var ticker = JSON.parse(xhr.responseText);
      chrome.browserAction.setBadgeText({ text: '+/-' });
      var bg = color_up;
      if (ticker['last'] >= ticker['vwap'])
        bg = color_down;
      chrome.browserAction.setBadgeBackgroundColor({ color: bg });
    }
    
    if (xhr.readyState == 4) {
      var ticker = JSON.parse(xhr.responseText);
      chrome.browserAction.setTitle({ text: '' + Math.floor(ticker['last']) });
    }
    
  }
  xhr.send();
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm)
    updateTicker();
});
chrome.alarms.create('update', { delayInMinutes: 0, periodInMinutes:3 });

updateTicker();

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({ url: click_url_base + currency });
});
