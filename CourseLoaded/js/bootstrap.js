// Browser Action toggle button
var block_toggle;

chrome.storage.local.get('block_toggle', function(result){
  if(result.block_toggle === undefined){
    chrome.storage.local.set({'block_toggle': false});
    result.block_toggle = false;
    alert("Just set the default value to false");
  }
  block_toggle = result.block_toggle;
});


if(block_toggle==false){
  chrome.browserAction.setIcon({path:"/images/logo-off-38.png"});
}else{
  chrome.browserAction.setIcon({path:"/images/logo-38.png"});
}

function updateState(){
    if(block_toggle==false){
        alert("Enabled");
        chrome.browserAction.setIcon({path:"/images/logo-38.png"});
        executeInAllBlockedTabs();
    }
    if(block_toggle==true){
        alert("Disabled");
        chrome.browserAction.setIcon({path:"/images/logo-off-38.png"});
    }
    if(block_toggle !== undefined){
      block_toggle = !block_toggle;
      chrome.storage.local.set({'block_toggle': true});
    }else{
      block_toggle = false;
      alert("This code should not run");
    }
}

  function defaultPrefs() {
  return {
    siteList: [
      'facebook.com',
      'youtube.com',
      'twitter.com',
      'tumblr.com',
      'pinterest.com',
      'myspace.com',
      'livejournal.com',
      'digg.com',
      'stumbleupon.com',
      'reddit.com',
      'kongregate.com',
      'newgrounds.com',
      'addictinggames.com',
      'hulu.com'
    ],
    durations: { // in seconds
      work: 25 * 60,
      break: 5 * 60
    },
    shouldRing: true,
    clickRestarts: false,
    whitelist: false
  }
}

var PREFS = defaultPrefs();

function parseLocation(location) {
  if(location === undefined){
    return;
  }
  var components = location.split('/');
  return {domain: components.shift(), path: components.join('/')};
}

function pathsMatch(test, against) {
  /*
    index.php ~> [null]: pass
    index.php ~> index: pass
    index.php ~> index.php: pass
    index.php ~> index.phpa: fail
    /path/to/location ~> /path/to: pass
    /path/to ~> /path/to: pass
    /path/to/ ~> /path/to/location: fail
  */

  return !against || test.substr(0, against.length) == against;
}

function domainsMatch(test, against) {
  /*
    google.com ~> google.com: case 1, pass
    www.google.com ~> google.com: case 3, pass
    google.com ~> www.google.com: case 2, fail
    google.com ~> yahoo.com: case 3, fail
    yahoo.com ~> google.com: case 2, fail
    bit.ly ~> goo.gl: case 2, fail
    mail.com ~> gmail.com: case 2, fail
    gmail.com ~> mail.com: case 3, fail
  */

  // Case 1: if the two strings match, pass
  if(test === against) {
    return true;
  } else {
    console.log(test);
    var testFrom = test.length - against.length - 1;

    // Case 2: if the second string is longer than first, or they are the same
    // length and do not match (as indicated by case 1 failing), fail
    if(testFrom < 0) {
      return false;
    } else {
      // Case 3: if and only if the first string is longer than the second and
      // the first string ends with a period followed by the second string,
      // pass
      return test.substr(testFrom) === '.' + against;
    }
  }
}

function locationsMatch(location, listedPattern) {
  return domainsMatch(location.domain, listedPattern.domain) &&
    pathsMatch(location.path, listedPattern.path);
}

function isLocationBlocked(location) {
  for(var k in PREFS.siteList) {
    listedPattern = parseLocation(PREFS.siteList[k]);
    if(locationsMatch(location, listedPattern)) {
      // If we're in a whitelist, a matched location is not blocked => false
      // If we're in a blacklist, a matched location is blocked => true
      return !PREFS.whitelist;
    }
  }
  
  // If we're in a whitelist, an unmatched location is blocked => true
  // If we're in a blacklist, an unmatched location is not blocked => false
  return PREFS.whitelist;
}

function executeInTabIfBlocked(tab) {
  var location = tab.url.split('://');
  location = parseLocation(location[1]);

  if(block_toggle && isLocationBlocked(location)) {
    chrome.tabs.update(tab.id, {url: chrome.extension.getURL('html/blocked.html')});
  }
}

function executeInAllBlockedTabs() {
  var windows = chrome.windows.getAll({populate: true}, function (windows) {
    var tabs, tab, domain, listedDomain;
    for(var i in windows) {
      tabs = windows[i].tabs;
      for(var j in tabs) {
        executeInTabIfBlocked(tabs[j]);
      }
    }
  });
}

if(block_toggle === true){
  executeInAllBlockedTabs();
}

chrome.browserAction.onClicked.addListener(updateState);

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if(block_toggle){
      executeInTabIfBlocked(tab);
    }
});


// Function called if AdBlock is not detected
function adBlockNotDetected() {
    $('#ad-block-alert').show();
}
// Function called if AdBlock is detected
function adBlockDetected() {
    $('#ad-block-alert').hide();
}

// Recommended audit because AdBlock lock the file 'fuckadblock.js' 
// If the file is not called, the variable does not exist 'fuckAdBlock'
// This means that AdBlock is present
if(typeof fuckAdBlock === 'undefined') {
    adBlockDetected();
} else {
    fuckAdBlock.onDetected(adBlockDetected);
    fuckAdBlock.onNotDetected(adBlockNotDetected);
    // and|or
    fuckAdBlock.on(true, adBlockDetected);
    fuckAdBlock.on(false, adBlockNotDetected);
    // and|or
    fuckAdBlock.on(true, adBlockDetected).onNotDetected(adBlockNotDetected);

    // Change the options
    fuckAdBlock.setOption('checkOnLoad', false);
    // and|or
    fuckAdBlock.setOption({
        debug: true,
        checkOnLoad: false,
        resetOnEnd: false
});
    }