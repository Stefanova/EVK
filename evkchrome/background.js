var urlRegex = /^https:\/\/app\.eschool\.center/;

chrome.action.onClicked.addListener(async function(tab) {
  //console of DevTool
  console.log(tab.url);
  if (!urlRegex.test(tab.url)) return;
  //if (tab.url?.startsWith("chrome://")) return;

  var rez = await chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: analyseDocument
  });
  console.log(rez);
});

function analyseDocument() {
//console of target TAB
console.log(333);
// ec-header
var list  = document.getElementsByClassName('ec-day');
console.log(list);

// https://developer.mozilla.org/en-US/docs/Web/XPath/Introduction_to_using_XPath_in_JavaScript
// //*[@id="calendar"]/div/div[2]/div[2]/div[2]
var listDates = document.evaluate(
  '//div[class="ec-header"]//div[class="ec-day"]',
  document,
  null,
  XPathResult.ANY_TYPE,
  null,
);

console.log(
  listDates
);
return 1;


//Create ans save file
var content = "text;text;text\r\ntext1;text2;text3;";

// Create element with <a href="https://ya.ru">text</a> tag
const link = document.createElement("a");

// Create a blog object with the file content which you want to add to the file
const file = new Blob([content], { type: 'text/csv;charset=utf-8;' });

// Add file content in the object URL
link.href = URL.createObjectURL(file);

// Add file name
link.download = "sample.csv";

// Add click event to <a> tag to save file.
link.click();
URL.revokeObjectURL(link.href);
return 123;
}