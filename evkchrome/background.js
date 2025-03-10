var urlRegex = /^https:\/\/app\.eschool\.center/;

chrome.action.onClicked.addListener(async function(tab) {
  if (!urlRegex.test(tab.url)) return;

  var rez = await chrome.scripting.executeScript({
    target: {tabId: tab.id},
    //files: ["https://apis.google.com/js/api.js"],
    func: analyseDocument
  });
});

function analyseDocument() {
console.log("analyseDocument");
var apiKey = "";
var clientId = "";
var discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1"];
var scopes = 'profile';

function loadScript(url, callback)
{
    // adding the script element to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   // then bind the event to the callback function
   // there are several events for cross browser compatibility
   //script.onreadystatechange = callback;
   script.onload = callback;

   // fire the loading
   head.appendChild(script);
}

function callbackLoadScript() {
    console.log("callbackLoadScript", gapi);

}

 function initClient() {
        gapi.client.init({
            apiKey: apiKey,
            discoveryDocs: discoveryDocs,
            clientId: clientId,
            scope: scopes
        }).then(function () {
          // Listen for sign-in state changes.
          //gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          //updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

          //authorizeButton.onclick = handleAuthClick;
          //signoutButton.onclick = handleSignoutClick;
          console.log("123456");
        });
      }

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
    var rez = '"'+s.replaceAll('"', '')+'",'+startDate_s[0]+","+startDate_s[1]+","+endDate_s[0]+","+endDate_s[1]+"\r\n";
    return rez;
}

loadScript("https://apis.google.com/js/api.js", callbackLoadScript);
console.log(gapi);
return;
gapi.load('client:auth2', initClient);
return;
var list  = document.getElementsByClassName('ec-day');

var listDates = document.querySelectorAll("div.ec-header div.ec-day");
var listDates2 = document.querySelectorAll("div.ec-body div.ec-day");

var date1 = document.getElementById("today").value;
var ev_year = date1.split(".")[2];

var file_text = "Subject,Start Date,Start Time,End Date,End Time\r\n";

for (var i = 0; i < listDates.length; i++) {
    var d = listDates[i];
    var ed = listDates2[i];
    var ev_date = d.innerText;
    var listEvents = ed.querySelectorAll('div.ec-event');
    for (var j = 0; j < listEvents.length; j++){
        var ev = listEvents[j];
        var ev_time = ev.querySelector('div.ec-event-time').innerText;
        var ev_group = ev.querySelector('div.lessons-group');
        if (ev_group) {
            var ev_list = ev_group.querySelectorAll('div[id]');
            for (var k = 0; k < ev_list.length; k++) {
                var ev_1 = ev_list[k];
                var ev_title = ev_1.querySelector('div.flex-1.link-style').innerText;
                ev_title = ev_title.replaceAll(";", " ").replaceAll(",", " ");
                file_text += calendarString(ev_year, ev_date, ev_time, ev_title);
            }
        } else {
            var ev_title = ev.querySelector('div.ec-event-title span.link-style').innerText;
                ev_title = ev_title.replaceAll(";", " ").replaceAll(",", " ");
                file_text += calendarString(ev_year, ev_date, ev_time, ev_title);
        }
    }
}


// Create element with <a href="https://ya.ru">text</a> tag
const link = document.createElement("a");

// Create a blog object with the file content which you want to add to the file
const file = new Blob([file_text], { type: 'text/csv;charset=utf-8;' });

// Add file content in the object URL
link.href = URL.createObjectURL(file);

// Add file name
link.download = "EVK_"+date1.replaceAll(".", "-")+".csv";

// Add click event to <a> tag to save file.
link.click();
URL.revokeObjectURL(link.href);
return 123;
}

