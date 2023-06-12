const openAIAPIKey = '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';
const promptEnding = "Try to preserve the main point of what is being said. Rewrite the following:\n";
const prompts = [
  {
    "id": "nice",
    "title": "Nice and Friendly",
    "prompt": `Rewrite the following text to be nice and friendly. ` +
      `Remove any inappropriate content and try to make it professional and respectful. ` +
      promptEnding,
  },
  {
    "id": "bold",
    "title": "Bold and Ambitious",
    "prompt": `Rewrite the following text to be bolder and more ambitious. ` +
      `Make it sound grand and amazing. ` +
      promptEnding,
  },
  {
    "id": "happy",
    "title": "Happy and Optimistic",
    "prompt": `Rewrite the following text to be happier and more optimistic. ` +
      `It should put me in a positive mood. ` +
      `Use positive words and a cheerful tone. ` +
      promptEnding,
  },
  {
    "id": "logical",
    "title": "Terse and Logical",
    "prompt": `Rewrite the following text to be terse and logical. ` +
      `It should be straight to the point. ` +
      `Get rid of the fluff. ` +
      `Remove any and all unnecessary words. ` +
      promptEnding,
  },
  {
    "id": "funny",
    "title": "Funny and Humorous",
    "prompt": `Rewrite the following text to be humorous and funny. ` +
      `Add in a joke here or there. ` +
      `Make it more light hearted and fun. ` +
      promptEnding,
  },
  {
    "id": "official",
    "title": "Official and Bureaucratic",
    "prompt": `Rewrite the following text to sound more official and bureaucratic. ` +
      `It should sound like a robot wrote it, or a very astute communications person. ` +
      `Make it sound like how a government, large corporation or lawyer would write a press release. ` +
      promptEnding,
  },
]

function findPromptById(id) {
  for (let prompt of prompts) {
    if (prompt.id === id) {
      return prompt;
    }
  }
  return null;
}

function replaceSelectedText(newText, tab) {
  // Send a message to the content script to replace the selected text
  browser.tabs.sendMessage(tab.id, {
    action: "replaceText",
    newText: newText,
  });
}


function handleClick(info, tab) {
  const prompt = findPromptById(info.menuItemId);
  const selectedText = info.selectionText;
  const chatGptCommand = `${prompt.prompt}\n${selectedText}`;

  // Make an API call using the fetch API
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST", // Specify the HTTP method (e.g., POST, GET, etc.)
    headers: {
      "Content-Type": "application/json", // Set the Content-Type header if required
      "Authorization": `Bearer ${openAIAPIKey}`,
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": chatGptCommand}],
      "temperature": 0.7
    }), // Pass any data in the request body
  })
    .then((response) => response.json())
    .then((data) => {
      const text = data.choices[0].message.content;
      replaceSelectedText(text, tab);
    })
    .catch((error) => {
      replaceSelectedText(JSON.stringify(error, null, 4), tab);
    });
}


browser.contextMenus.create({
  id: "rewrite-text-base",
  title: "Rewrite text",
  contexts: ["selection"],
});

for (let promptInfo of prompts) {
  browser.contextMenus.create({
    id: promptInfo.id,
    parentId: "rewrite-text-base",
    title: promptInfo.title,
    contexts: ["selection"],
  });
}

browser.contextMenus.onClicked.addListener(handleClick);


