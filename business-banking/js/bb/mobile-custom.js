$(document).ready(function () {
    var ua = navigator.userAgent;
    checker = {
        iphone: ua.match(/(iPhone|iPod|iPad)/),
        blackberry: ua.match(/BlackBerry/),
        bb10: ua.match(/BB10/),
        android: ua.match(/Android/),
        windows: ua.match(/Windows Phone 8.1/)
    };

    $('#tdapp').click(function () {
        if (checker.android) {
            appchecker = setTimeout(function () {
                window.location = "https://market.android.com/details?id=com.td&amp;feature=search_result";
            }, 25);
            window.location = "tdct://";
        }
        else if (checker.iphone) {
            appchecker = setTimeout(function () {
                window.location = "http://itunes.apple.com/ca/app/td/id358790776?mt=8";
            }, 25);
            window.location = "tdct://";
        }
        else if (checker.blackberry) {
            window.open("http://www.td.com/blackberryapp/download", "_blank");
        } else if (checker.bb10) {
            window.open("http://appworld.blackberry.com/webstore/content/10661/?countrycode=CA&amp;lang=en", "_blank");
        } else if (checker.windows) {
            if (window.location.href.indexOf("francais") > -1) {
                window.location = "http://www.windowsphone.com/fr-ca/store/app/td-canada/abcc69e3-9d19-41ef-b84d-1591a9d0c35f";
            } else {
                window.location = "http://www.windowsphone.com/en-ca/store/app/td-canada/abcc69e3-9d19-41ef-b84d-1591a9d0c35f";
            }
        }
    });

});