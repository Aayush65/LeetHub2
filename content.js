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

async function sendDetails() {
	// submission id
	const regex = /\/submissions\/(\d+)\//;
	const submissionId = regex.exec(window.location.href)[1];

	// fetching submission details from graphql
	const submissionDetailsQuery = {
		query:
		  '\n    query submissionDetails($submissionId: Int!) {\n  submissionDetails(submissionId: $submissionId) {\n    runtime\n    runtimeDisplay\n    runtimePercentile\n    runtimeDistribution\n    memory\n    memoryDisplay\n    memoryPercentile\n    memoryDistribution\n    code\n    timestamp\n    statusCode\n    lang {\n      name\n      verboseName\n    }\n    question {\n      questionId\n    title\n    titleSlug\n    content\n    difficulty\n    }\n    notes\n    topicTags {\n      tagId\n      slug\n      name\n    }\n    runtimeError\n  }\n}\n    ',
		variables: { submissionId: submissionId },
		operationName: 'submissionDetails',
	  };

	const method = {
		method: 'POST',
		headers: {
		  cookie: document.cookie, // required to authorize the API request
		  'content-type': 'application/json',
		},
		body: JSON.stringify(submissionDetailsQuery),
	  };

	const data = await fetch('https://leetcode.com/graphql/', method)
	  .then(res => res.json())
	  .then(res => res.data.submissionDetails);

	// send all details
	chrome.runtime.sendMessage(data); 
	return data;
}

waitForRendering('[data-e2e-locator="console-submit-button"]', pageRendered);