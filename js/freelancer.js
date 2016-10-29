/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */
let attendance = [];
let studentlist = []
let ATTENDANCESPREADSHET=[];
const GREET = ["Yo","Hey","Sup","Greetings"];
const PHRASE = ["how are ya?","how's life?","what's up?","all good?"];

$(document).ready(() => {
  $(window).keydown((event) => {
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

  $.ajax({
    type: "GET",
    url:'https://spreadsheets.google.com/feeds/list/1YZ1tm9CrBOVhOvc05bWCNmLNtTgLaRNMgBefrgw9iW8/1/public/basic?alt=json',
    success: function(data){
      var cells = data.feed.entry;
      for (var i = 0; i < cells.length; i++){
        var rowObj = {};
        rowObj.timestamp = cells[i].title.$t;
        var rowCols = cells[i].content.$t.split(',');
        for (var j = 0; j < rowCols.length; j++){
          var keyVal = rowCols[j].split(':');
          rowObj[keyVal[0].trim()] = keyVal[1].trim();
        }
        ATTENDANCESPREADSHET.push(rowObj);
      }
      for (i in ATTENDANCESPREADSHET){
        let student=ATTENDANCESPREADSHET[i];
        if (student["lastname"] != undefined){
          studentlist.push(`${student["timestamp"]} ${student["lastname"]}`)
        }
      }
    }
  });

});

$( "#names-input" ).autocomplete({
    /*Source refers to the list of fruits that are available in the auto complete list. */
    source:studentlist,
    /* auto focus true means, the first item in the auto complete list is selected by default. therefore when the user hits enter,
    it will be loaded in the textbox */
    autoFocus: false ,

  });
$("#play").hide();
$("#next").hide();
$("#names-input").hide();


$(function(){
     $(".name").typed({
       strings: ["Sign up?"],
       typeSpeed: 50,
       startDelay: 1000,
       cursorChar: "_",
       callback: function(){
         $('.typed-cursor').hide();
         $("#names-input").fadeIn(1000);
         $("#play").fadeIn(1000);
         $("#next").fadeIn(1000);
         $("#names-input").focus();
       },
     });
 });
 console.log($("#next"))
 $("#next").click(function(event){
    event.preventDefault();
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    date = year + "" + month + "" + day;
    download(attendance, `${date}_attendance.csv`, 'text/csv');
    return false;
 });
const download = (content, fileName, mimeType) => {
  const a = document.createElement('a');
  console.log("this got called");
  mimeType = mimeType || 'application/octet-stream';

  if (navigator.msSaveBlob) { // IE10
    return navigator.msSaveBlob(new Blob([content], { type: mimeType }),     fileName);
  } else if ('download' in a) { //html5 A[download]
    a.href = `data:${mimeType},${encodeURIComponent(content)}`;
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } else { //do iframe dataURL download (old ch+FF):
    const f = document.createElement('iframe');
    document.body.appendChild(f);
    f.src = `data:${mimeType},${encodeURIComponent(content)}`;

    setTimeout(() => {
      document.body.removeChild(f);
    }, 333);
    return true;
  }
};

function nextPerson(){
  const name = $('#names-input').val();
  if (name == ""){
    $(".greetings").html("Type your full name in friend");
  } else if ($.inArray(name, attendance) != -1) {
    const firstName = name.match(/(\w+)/)[0]
    $(".greetings").html(`You already sign up ${firstName}!`);
  } else if ($.inArray(name, studentlist) != -1) {
    const firstName = name.match(/(\w+)/)[0]
    const greetIndex = Math.floor(Math.random()*GREET.length);
    const phraseIndex = Math.floor(Math.random()*PHRASE.length);
    attendance.push(name);
    $(".greetings").text(`${GREET[greetIndex]} ${firstName}! ${PHRASE[phraseIndex]}`);
  }
  else {
    attendance.push(name);
    $(".greetings").html("Seems like you aren't in our list yet. Can you sign up at <a href=\"bit.ly/wcssmembers\">bit.ly/wcssmembers</a>? Thanks");
  }
  $('#names-input').val("");
  console.log(attendance);
};

$("#names-input").keydown(function(event){
    if(event.keyCode == 13){
        $("#play").click();
    }
});
