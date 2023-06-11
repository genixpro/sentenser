const openAIAPIKey = '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';

function replaceSelectedText(newText, tab) {
  // Send a message to the content script to replace the selected text
  browser.tabs.sendMessage(tab.id, {
    action: "replaceText",
    newText: newText,
  });
}


function handleClick(info, tab) {
  console.log("Selected text:", info.selectionText);

  // replaceSelectedText("Hello, world!", tab);

  // Make an API call using the fetch API
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST", // Specify the HTTP method (e.g., POST, GET, etc.)
    headers: {
      "Content-Type": "application/json", // Set the Content-Type header if required
      "Authorization": `Bearer ${openAIAPIKey}`,
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": `Rewrite the following text to be nicer:\n\n${info.selectionText}`}],
      "temperature": 0.7
    }), // Pass any data in the request body
  })
    .then((response) => response.json())
    .then((data) => {
      const text = data.choices[0].message.content;


      replaceSelectedText(text, tab);
      // replaceSelectedText(JSON.stringify(data, null, 4), tab);
      // Handle the response data
      // alert(`API response: ${data}`);
      // Perform any further processing or actions based on the API response
    })
    .catch((error) => {
      replaceSelectedText(JSON.stringify(error, null, 4), tab);
      // alert(`API error: ${error}`);
    });
}

browser.contextMenus.create({
  id: "rewrite-nicer-text",
  title: "Rewrite text to be nicer",
  contexts: ["selection"],
});

browser.contextMenus.onClicked.addListener(handleClick);


