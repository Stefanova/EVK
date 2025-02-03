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

function calendarString(y, d, t, s) {
    var d1 = d.split(" ")[1];
    var d2 = d1.split(".");
    var month = d2[1];
    var day = d2[0];
    var t1 = t.split(" - ");
    var t11 = t1[0].split(":");
    var startHour = t11[0];
    var startMin = t11[1];
    var t12 = t1[1].split(":");
    var endHour = t12[0];
    var endMin = t12[1];
    var startDate = new Date(y, month, day, startHour, startMin);
    var startDate_s = startDate.toLocaleString("en-US").split(", ");
    var endDate = new Date(y, month, day, endHour, endMin);
    var endDate_s = endDate.toLocaleString("en-US").split(", ");
    var rez = s+";"+startDate_s[0]+";"+startDate_s[1]+";"+endDate_s[0]+";"+endDate_s[1]+"\r\n";
    return rez;
    //console.log(startDate, endDate, startDate.toLocaleString("en-US"));
    // Subject	Start Date	Start Time	End Date	End Time	All Day Event	Description	Location	Private
}

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

var date1 = document.getElementById("today").value;
var ev_year = date1.split(".")[2];

var file_text = "";

for (var i = 0; i < listDates.length; i++) {
    var d = listDates[i];
    var ed = listDates2[i];
    var ev_date = d.innerText;
    //console.log(i, d.innerText);
    var listEvents = ed.querySelectorAll('div.ec-event');
    console.log(listEvents);
    for (var j = 0; j < listEvents.length; j++){
        var ev = listEvents[j];
        var ev_time = ev.querySelector('div.ec-event-time').innerText;
        var ev_group = ev.querySelector('div.lessons-group');
        if (ev_group) {
            var ev_list = ev_group.querySelectorAll('div[id]');
            for (var k = 0; k < ev_list.length; k++) {
                var ev_1 = ev_list[k];
                var ev_title = ev_1.querySelector('div.flex-1.link-style').innerText;
                console.log(ev_date, ev_time, ev_title);
                file_text += calendarString(ev_year, ev_date, ev_time, ev_title);
            }
        } else {
            var ev_title = ev.querySelector('div.ec-event-title span.link-style').innerText;
                console.log(ev_date, ev_time, ev_title);
                file_text += calendarString(ev_year, ev_date, ev_time, ev_title);
        }
    }
}
//return 1;


//Create ans save file
//var content = "text;text;text\r\ntext1;text2;text3;";

// Create element with <a href="https://ya.ru">text</a> tag
const link = document.createElement("a");

// Create a blog object with the file content which you want to add to the file
const file = new Blob([file_text], { type: 'text/csv;charset=utf-8;' });

// Add file content in the object URL
link.href = URL.createObjectURL(file);

// Add file name
link.download = "sample.csv";

// Add click event to <a> tag to save file.
link.click();
URL.revokeObjectURL(link.href);
return 123;
}

