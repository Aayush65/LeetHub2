let url = "/welcome.html"
const button = document.querySelector('#authorise'); 
button.addEventListener("click", handleClick);

function handleClick() {
    chrome.tabs.create({ url, active: true });
}