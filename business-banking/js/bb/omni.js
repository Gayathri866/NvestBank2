/*
The code is pulled from https://www.tdcanadatrust.com/includes/javascript/omni/json_omni.js
Added public methods OmniOnloadTrigger and OmniSearchTrigger to be triggered after login (application.js) and search (selfhelpbundle.js)
*/
function OmniOnloadTrigger() {
    if (readCookie("omSessionID") != null && omniRequestValue != "") {
        setContextValues("false", "");
    }
}

function OmniSearchTrigger(searchText) {
    if (readCookie("omSessionID") != null && omniRequestSearchValue != "" && searchText != "") {
        setContextValues("true", searchText);
    }
}

function setContextValues(searchtrigger, searchText) {

    var jsonText = {};
    var encodedJson = "";
    var omSessionID = "";
    var ensearchValue = "";
    var frsearchValue = "";
    var lang = document.documentElement.lang;

    var map = new Object();
    var requestvalues;
	try
{
    if (searchtrigger == "false") {
        requestvalues = omniRequestValue;
    } else {
        requestvalues = omniRequestSearchValue;
    }
	var deviceTime = new Date();

	var stroffset = (((new Date()+"").split("GMT")[1]).split("(")[0]).trim();
	var finalOffset = stroffset.substring(0, 3)+":"+stroffset.substring(3,5);	

	
  var deviceDate = new Date();
  var UTCTimeStamp=deviceDate.toUTCString();
  var UTCTimeStampCommaSplitted = UTCTimeStamp.split(",")[1];
  var UTCTimeStampSpaceSplitted = UTCTimeStampCommaSplitted.split(" ");
  var currentDate = UTCTimeStampCommaSplitted.split(" ")[1];
  var month="JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(UTCTimeStampSpaceSplitted[2]) / 3 + 1 ;
  var hours=(UTCTimeStampSpaceSplitted[4].split(":")[0]);
  var minutes = (UTCTimeStampSpaceSplitted[4].split(":")[1]);
  hours = hours % 12;
  hours = hours ? hours : 12;
  var ampm = hours >= 12 ? 'PM' : 'AM';
  var seconds=(UTCTimeStampSpaceSplitted[4].split(":")[2]);
  var milliSeconds=deviceDate.getMilliseconds();
  if(month<10)
  {
  month="0"+month;
  }
  if(currentDate<10)
  {
  currentDate="0"+currentDate;
  }
  if(hours<10)
  {
hours="0"+hours;
}

  if(seconds<10)
  {
seconds="0"+seconds;
}

if(milliSeconds<100&&milliSeconds>10)
{
milliSeconds="0"+milliSeconds;
}
if(milliSeconds<10)
{
milliSeconds="00"+milliSeconds;
}


  minutes = minutes < 10 ? '0'+minutes : minutes;
  var dateFormat=deviceDate.getFullYear()+"-"+month+"-"+currentDate+"T";
  var strTime = hours + ':' + minutes+ ':' + seconds + '.' + milliSeconds+"Z";
	deviceTime=dateFormat+strTime;
	
    var producttypecdValue;
    var requestval = requestvalues.split(";");
    for (var i = 0; i < requestval.length - 1; i++) {
        var keyvalue = requestval[i].split("=");
        if (keyvalue[0] && keyvalue[1])
            map[keyvalue[0].trim()] = keyvalue[1].trim();
    }

    if (searchtrigger == "true") {
		ensearchValue = searchText;
    }

    if (!("productTypeCd" in map)) {
        producttypecdValue = "";
    } else {
        producttypecdValue = map["productTypeCd"];
    }
    var urlmap = map["urlTxt"];
    if (urlmap == "hiddenurl") {
        urlmap = document.getElementById('urlhidden').value;
    }

    var eventGroupKey = {
        eventGroupId: "",
        issuerId: "WCM",
    };
    var eventGroup = {
        eventGroupKey: eventGroupKey,
        eventGroupActivityTypeCd: map["eventGroupActivityTypeCd"],
        sourceTransactionId: "",
        progressStatusCd: map["progressStatusCd"]
    };
    var eventProduct = {
        productEnglishShortName: "",
        productFrenchShortName: "",
        productEnglishLongName: "",
        productFrenchLongName: "",
    };
    var eventKey = {
        eventId: "",
        issuerId: map["eventKeyIsuuerId"],
    };

    var event = {
        eventKey: eventKey,
        activityTypeCd: map["activityTypeCd"],
        traceId: "",
        eventEnglishDesc: ensearchValue,
        eventFrenchDesc: ensearchValue,
        deviceUTCStartDttm: deviceTime,
        deviceUTCOffsetTxt: finalOffset,
        serverUTCStartDttm: "",
        serverUTCOffsetTxt: "",
        channelTypeCd: map["channelTypeCd"],
        corporateSegmentCd: map["corporateSegmentCd"],
        lobCd: map["lobCd"],
        sourceTransactionId: "",
        productTypeCd: producttypecdValue,
        eventProduct: eventProduct,
        offerId: "",
        urlTxt: urlmap,
        successfulInd: map["successfulInd"] === "TRUE",
        auditInd: map["auditInd"] === "TRUE"
    };
    var tpPartyKey = {
        partyId: "   ",
        issuerId: "  ",
    };
    var tpAltPartyKey = {
        partyId: "45457655",
        issuerId: "DYN",
    };
    var customer = {
        partyKey: tpPartyKey
    };

    var visit = {
        sourceSessionId: "3549829",
        macAddressVal: "EC:9B:F3:78:02:BF",
        browserOperatingSystemNum: "Windows 7",
        accessDeviceNum: "5525370",
        browserResolutionTypeCd: "2160X3840",
        screenResolutionTypeCd: "2160X3845",
        visitorInternetProtocolAddressNum: "196.235.10.29",
    };

    var ixEvent = {
        eventGroup: eventGroup,
        event: event,
        customer: customer
    };
    jsonText = JSON.stringify(ixEvent);
    encodedJson = encodeURI(jsonText);
    omSessionID = readCookie("omSessionID");
	if(urlmap!=null && urlmap!="" && urlmap!="false")
	{
    omniServletCall(encodedJson, omSessionID);
	}
	}
	catch(error)
	{
	console.log("Exception is"+error);
	}
}

function omniServletCall(encodedJson, omSessionID) {

    var url = omniUrl + "?callback=mycallback&json=" + encodedJson + "&randomKey=" + omSessionID + "&jsonp=GetResponse";
	$.getJSON(url, function (data) {
        console.log(data);
    });
    mycallback = function (data) {
        console.log(data);
    };
}
Date.prototype.addOffset = function(h,m){
    this.setHours(this.getHours()+h);
	this.setMinutes(this.getMinutes()+m);
    return this;
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {

        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}
