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
			console.log(sendDetails());
			clearInterval(checkingForSuccess);
			return;
		}
	}, 1000)
}

function sendDetails() {
	details = {};
	
	// send Code
	details.code = document.getElementsByTagName("code")[0].innerText;

	// send code language
	details.lang = document.querySelector("#qd-content > div.h-full.flex-col.ssg__qd-splitter-secondary-w > div > div.min-h-0.flex-grow > div > div.flex.h-full.w-full.flex-col.overflow-hidden.rounded > div.bg-layer-1.dark\\:bg-dark-layer-1.flex.h-full.w-full.flex-col.overflow-auto.rounded-b.p-5 > div:nth-child(2) > span").innerText;

	// send submission id
	const regex = /\/submissions\/(\d+)\//;
	const matches = regex.exec(window.location.href);
	if (matches && matches.length > 1)
		details.submissionId = matches[1]
		
	// send all details
	chrome.runtime.sendMessage(details); 
	return details;
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
	subtree: true
});
