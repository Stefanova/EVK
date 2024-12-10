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
var listDates = document.querySelectorAll("div.ec-header div.ec-day");
var listDates2 = document.querySelectorAll("div.ec-body div.ec-day");
console.log(
  listDates, listDates2
);
for (var i = 0; i < listDates.length; i++) {
    var d = listDates[i];
    var ed = listDates2[i];
    console.log(i, d.innerText);
    var listEvents = ed.querySelectorAll('div.ec-event');
    console.log(listEvents);
    for (var j = 0; j < listEvents.length; j++){
        var ev = listEvents[j];
        var ev_time = ev.querySelector('div.ec-event-time').innerText;
        if (ev.querySelector('div.ec-event-title span.link-style') != null) {
            var ev_title = ev.querySelector('div.ec-event-title span.link-style').innerText;
        }
        else {
            var ev_title = ev.querySelector('div.ec-event-title').innerText;
        }
        console.log(ev_time, ev_title);
    }
}
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