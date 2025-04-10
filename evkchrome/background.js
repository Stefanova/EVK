var urlRegex = /^https:\/\/app\.eschool\.center/;
var lessonsCount = 0;

chrome.action.onClicked.addListener(async function(tab) {
    if (!urlRegex.test(tab.url)) return;

    var rez = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        //files: ["https://apis.google.com/js/api.js"],
        func: analyseDocument
    });
    //console.log(rez, rez[0], rez[0].result);
    if (!rez || !rez[0] || !rez[0].result || rez[0].result.length == 0) {
        return;
    }

    /** Info
     https://habr.com/ru/articles/668392/
     https://habr.com/ru/articles/703330/
     https://habr.com/ru/articles/524240/
     https://developers.google.com/identity/protocols/oauth2/policies#separate-projects
     https://habr.com/ru/articles/875464/
     https://habr.com/ru/companies/ru_mts/articles/837964/
     https://stackoverflow.com/questions/55935126/how-can-i-use-the-google-api-in-a-chrome-extension
    */

    lessonsCount = 0;
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        console.log(' TOKEN ' + token);
        for (var i = 0; i < rez[0].result.length; i++) {
            var evdata = rez[0].result[i];
            console.log(evdata);
            var event = {
                summary: evdata.title,
                //description: 'Create an event using chrome Extension',
                start: {
                  'dateTime': evdata.startDate2, //'2015-05-28T09:00:00-07:00',
                  'timeZone': 'Europe/Moscow'
                },
                end: {
                  'dateTime': evdata.endDate2,
                  'timeZone': 'Europe/Moscow'
                }
            };
            var fetch_options = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            };
            fetch(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                fetch_options
            )
            .then((response) => response.json()) // Transform the data into json
            .then(function (data) {
              console.log(data);//contains the response of the created event
            });
            lessonsCount++;
            if (lessonsCount > 2) break;
        }
    });

    await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: showAlert
    });

});

function showAlert(){
    alert("added events: "+lessonsCount);
}

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
        var rez = '"'+s.replaceAll('"', '')+'",'+startDate_s[0]+","+startDate_s[1]+","+endDate_s[0]+","+endDate_s[1]+"\r\n";
        return rez;
    }

    function calendarBox(y, d, t, s) {
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
        var startDate = new Date(y, month - 1, day, startHour, startMin);
        var startDate_s = startDate.toLocaleString("en-US").split(", ");
        var endDate = new Date(y, month - 1, day, endHour, endMin);
        var endDate_s = endDate.toLocaleString("en-US").split(", ");
        var rez = {
        title: s.replaceAll('"', ''),
        startDate: startDate_s[0],
        startDate2: startDate.toISOString(),
        startTime: startDate_s[1],
        endDate: endDate_s[0],
        endDate2: endDate.toISOString(),
        endTime: endDate_s[1]
        };
        return rez;
    }

    var list  = document.getElementsByClassName('ec-day');

    var listDates = document.querySelectorAll("div.ec-header div.ec-day");
    var listDates2 = document.querySelectorAll("div.ec-body div.ec-day");

    var date1 = document.getElementById("today").value;
    var ev_year = date1.split(".")[2];

    var file_text = "Subject,Start Date,Start Time,End Date,End Time\r\n";
    var result = [];

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
                    var r = calendarBox(ev_year, ev_date, ev_time, ev_title);
                    result.push(r);
                }
            } else {
                var ev_title = ev.querySelector('div.ec-event-title span.link-style').innerText;
                    ev_title = ev_title.replaceAll(";", " ").replaceAll(",", " ");
                    file_text += calendarString(ev_year, ev_date, ev_time, ev_title);
                    var r = calendarBox(ev_year, ev_date, ev_time, ev_title);
                    result.push(r);
            }
        }
    }

    //download resulting CSV file
    /*const link = document.createElement("a");
    const file = new Blob([file_text], { type: 'text/csv;charset=utf-8;' });
    link.href = URL.createObjectURL(file);
    link.download = "EVK_"+date1.replaceAll(".", "-")+".csv";
    link.click();
    URL.revokeObjectURL(link.href);
    */

    return result;
}

