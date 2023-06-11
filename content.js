// Listen for messages from the background script
browser.runtime.onMessage.addListener(function (message) {
  if (message && message.action === "replaceText" && message.newText) {
    replaceText(message.newText);
  }
});

function replaceText(nextText) {
  const inputElement = findActiveInputBox();
  if (inputElement) {
    replaceTextEventSendMethod(inputElement, nextText);
    sendInputChangedEvents(inputElement);
  }
}

function replaceTextValueUpdateMethod(inputElement, newText) {
  const selectionStart = inputElement.selectionStart;
  const selectionEnd = inputElement.selectionEnd;
  const selectedText = inputElement.value.substring(selectionStart, selectionEnd);

  if (selectedText) {
    const beforeText = inputElement.value.substring(0, selectionStart);
    const afterText = inputElement.value.substring(selectionEnd, inputElement.value.length);
    inputElement.value = beforeText + newText + afterText;
    return inputElement;
  }
}

function replaceTextEventSendMethod(inputElement, newText) {
  const selectionStart = inputElement.selectionStart;
  const selectionEnd = inputElement.selectionEnd;

  // Replace the selected text using document.execCommand
  document.execCommand("insertText", false, newText);

  // inputElement.selectionStart = selectionStart;
  // inputElement.selectionEnd = selectionStart + newText.length;
}

function replaceTextSelectionRangeMethod(inputElement, newText) {
  var selection = inputElement.ownerDocument.defaultView.getSelection();

  var range = selection.getRangeAt(0);

  range.deleteContents();
  range.insertNode(document.createTextNode(newText));

  // Adjust the selection after replacing the text
  range.setStartAfter(range.endContainer);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function sendInputChangedEvents(inputElement) {
  // Trigger input or change event to simulate value update
  const inputEvent = new Event("input", {bubbles: true});
  inputElement.dispatchEvent(inputEvent);

  const changeEvent = new Event("change", {bubbles: true});
  inputElement.dispatchEvent(changeEvent);
}

function findActiveInputBox() {
  const activeElement = document.activeElement;

  if (
    activeElement &&
    (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.contentEditable === "true")
  ) {
    return activeElement;
  }

  return null;
}