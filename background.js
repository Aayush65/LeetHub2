function handleMessage(request, sender, sendResponse) {
  console.log("Handle Message Running!");
  const code = request.code;
  console.log(code);  
}

console.log("Script Running");
chrome.runtime.onMessage.addListener(handleMessage);