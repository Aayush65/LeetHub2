function pageRendered(submitButton) {
  console.log("Page Rendered");
  submitButton.addEventListener("click", handleSubmitButtonClick);
}

function handleSubmitButtonClick() {
  console.log("Button Clicked!");
  let iteration = 0;
  const checkingForSuccess = setInterval(() => {
    iteration++;
    if (iteration > 10) {
      console.log("Timeout");
      clearInterval(checkingForSuccess);
      return;
    }
    const success = document.querySelector('[data-e2e-locator="submission-result"]');
    if (success) { 
      console.log("Success!");
      console.log(window.location.href);
      console.log(document.getElementsByTagName("code")[0].innerHTML);
      
      clearInterval(checkingForSuccess);
      return;
    }
  }, 1000)
  // chrome.runtime.sendMessage({});
}

// All the code below this waits for the proper rendering of the page
const observer = new MutationObserver(function (mutations, mutationInstance) {
  // const submitButton = document.querySelector('[data-e2e-locator="console-run-button"]');
  const submitButton = document.querySelector('[data-e2e-locator="console-submit-button"]');
  if (submitButton) {
      pageRendered(submitButton);
      mutationInstance.disconnect();
  }
});

observer.observe(document, {
  childList: true,
  subtree:   true
});