// Listen for messages from the background script
browser.runtime.onMessage.addListener(function (message) {
  if (message && message.action === "replaceText" && message.newText) {
    replaceTextInInputBox(message.newText);
  }
});

function replaceTextInInputBox(newText) {
  var activeElement = document.activeElement;

  if (
    activeElement &&
    (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")
  ) {
    var selectionStart = activeElement.selectionStart;
    var selectionEnd = activeElement.selectionEnd;
    var selectedText = activeElement.value.substring(selectionStart, selectionEnd);

    if (selectedText) {
      const beforeText = activeElement.value.substring(0, selectionStart);
      const afterText = activeElement.value.substring(selectionEnd, activeElement.value.length);
      activeElement.value = beforeText + newText + afterText;
      return activeElement;
    }
  }
}