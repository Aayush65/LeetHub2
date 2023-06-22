function handleMessage(request, sender, sendResponse) {
  console.log("Handle Message Running!");
  
}

console.log("Script Running");
chrome.runtime.onMessage.addListener(handleMessage);