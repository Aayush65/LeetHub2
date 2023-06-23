const details = {};

function waitForRendering(query, fnWhenRendered) {
	const observer = new MutationObserver(function (mutations, mutationInstance) {
		const targetDiv = document.querySelector(query);
		if (targetDiv) {
			fnWhenRendered(targetDiv);
			mutationInstance.disconnect();
		}
	});
	
	observer.observe(document, {
		childList: true,
		subtree: true
	});
}

function pageRendered(submitButton) {
	console.log("Page Rendered");
	submitButton.addEventListener("click", handleSubmitButtonClick);
}

function mainPageOpened(desc) {
	console.log("Main Page Opened");
	details.probDesc = desc.innerText;

	const [probNo, probName] = document.querySelector("#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div.flex.h-full.w-full.overflow-y-auto.rounded-b > div > div > div.w-full.px-5.pt-5 > div > div:nth-child(1) > div.flex-1 > div > span").innerText.split('. ');
	details.probNo = probNo;
	details.probName = probName;
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
	// Code
	details.code = document.getElementsByTagName("code")[0].innerText;

	// code language
	details.lang = document.querySelector("#qd-content > div.h-full.flex-col.ssg__qd-splitter-secondary-w > div > div.min-h-0.flex-grow > div > div.flex.h-full.w-full.flex-col.overflow-hidden.rounded > div.bg-layer-1.dark\\:bg-dark-layer-1.flex.h-full.w-full.flex-col.overflow-auto.rounded-b.p-5 > div:nth-child(2) > span").innerText;

	// submission id
	const regex = /\/submissions\/(\d+)\//;
	const matches = regex.exec(window.location.href);
	if (matches && matches.length > 1)
		details.submissionId = matches[1]
	
	// runtime
	details.runtime = document.querySelector("#qd-content > div.h-full.flex-col.ssg__qd-splitter-secondary-w > div > div.min-h-0.flex-grow > div > div.flex.h-full.w-full.flex-col.overflow-hidden.rounded > div.bg-layer-1.dark\\:bg-dark-layer-1.flex.h-full.w-full.flex-col.overflow-auto.rounded-b.p-5 > div.flex.w-full.pb-4 > div:nth-child(1) > div.flex.items-center.justify-between.gap-4.flex-wrap.gap-y-2 > div:nth-child(1) > span.text-label-1.dark\\:text-dark-label-1.ml-2.font-medium").innerText;

	// memory
	details.memory = document.querySelector("#qd-content > div.h-full.flex-col.ssg__qd-splitter-secondary-w > div > div.min-h-0.flex-grow > div > div.flex.h-full.w-full.flex-col.overflow-hidden.rounded > div.bg-layer-1.dark\\:bg-dark-layer-1.flex.h-full.w-full.flex-col.overflow-auto.rounded-b.p-5 > div.flex.w-full.pb-4 > div:nth-child(2) > div.flex.items-center.justify-between.gap-4.flex-wrap.gap-y-2 > div:nth-child(1) > span.text-label-1.dark\\:text-dark-label-1.ml-2.font-medium").innerText;

	// send all details
	chrome.runtime.sendMessage(details); 
	return details;
}



waitForRendering('[data-e2e-locator="console-submit-button"]', pageRendered);
waitForRendering("#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div.flex.h-full.w-full.overflow-y-auto.rounded-b > div > div > div.px-5.pt-4 > div", mainPageOpened);