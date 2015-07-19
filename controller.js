// MyIO version 5 - covering: DM-005

var myIO = myIO || {};

myIO.controller = (function ($) {
    
    var month = new Array();
    month[0]="January";
    month[1]="February";
    month[2]="March";
    month[3]="April";
    month[4]="May";
    month[5]="June";
    month[6]="July";
    month[7]="August";
    month[8]="September";
    month[9]="October";
    month[10]="November";
    month[11]="December";
    var number_months = 3;
    
    var checkDB = function() {
        try {
            if (!window.openDatabase) {
                updateStatus("Error: WebDB not supported");
            }
            else {
                initDB();
                createDB();
                checkData();
            }
        }
        catch (e) {
            if (e == 2) {
                updateStatus("Error: invalid database version.");
            }
            else {
                updateStatus("Error: unknown error " + e + ".");
            }
            return;
        }
    };
    
    var initDB = function() {
        var shortName = 'MyIO';
        var version = '1.0';
        var displayName = 'MyIO';
        var maxSize = 65536;
        localDB = window.openDatabase(shortName, version, displayName, maxSize);
    };
    
    var createDB = function() {
        var query = 'CREATE TABLE IF NOT EXISTS myIO_DB (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, day INTEGER, month INTEGER, year INTEGER, value INTEGER, desc VARCHAR, balance INTEGER);';
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [], nullDataHandler, errorHandler);
                // updateStatus("Table 'myIO_DB' is present");
                // document.getElementById('database').innerHTML = ""; (removed on version 3)
            });
        }
        catch (e) {
            updateStatus("Error: unable to create table 'myIO_DB' " + e + ".");
            return;
        }
    };
    
    function checkData(){
        var query = 'SELECT * FROM myIO_DB;';
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [], function(transaction, results){
                    if (results.rows.length === 0) {
                        var mydate = new Date();
                        var m = mydate.getMonth();
                        var y = mydate.getFullYear();
                        if ((y%100!=0) && (y%4==0) || (y%400==0)){
                            var totalFeb = 29;
                        }
                        else {
                            var totalFeb = 28;
                        }
                        var totalDays = ["31", ""+totalFeb+"","31","30","31","30","31","31","30","31","30","31"]
                        var aux = m;
                        var aux2 = 1;
                        var i = 0;
                        var value = "";
                        var desc = "";
                        var balance = 0;
                        while (i < number_months) {
                            while (aux2 <= totalDays[aux] ) {
                                includeonDB(aux2, aux, y, value, desc, balance);
                                aux2++;
                            }
                            aux++;
                            if (aux === 12) {
                                aux = 0;
                                y++;
                            }
                            i++;
                            aux2 = 1;
                        }
                    }
                }, function(transaction, error){
                    updateStatus("Error: " + error.code + "<br>Message: " + error.message);
                });
            });
        }
        catch (e) {
            updateStatus("Error: unable to select myIO_DB from the db " + e + ".");
        }
    };
    
    function includeonDB(day, month, year, value, desc, balance){
        var query = 'insert into myIO_DB (day, month, year, value, desc, balance) VALUES (?, ?, ?, ?, ?, ?);';
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [day, month, year, value, desc, balance], function(transaction, results){
                    if (!results.rowsAffected) {
                        updateStatus("Error: no rows affected.");
                    }
                }, errorHandler);
            });
        }
        catch (e) {
            updateStatus("Error: unable to perform an INSERT " + e + ".");
        }
    };
    
    function showData(){
        var query = 'SELECT * FROM myIO_DB;';
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [], function(transaction, results){
                    for (var i = 0; i < results.rows.length; i++) {
                        var row = results.rows.item(i);
                        if (row['day'] == 1){
                            var hr = document.createElement("hr");
                            document.getElementById("database").appendChild(hr);
                            var h4 = document.createElement("h4");
                            var h4Text = document.createTextNode(month[row['month']]);
                            h4.appendChild(h4Text);
                            document.getElementById("database").appendChild(h4);
                        }
                        var li = document.createElement("li");
                        li.setAttribute("id", row[i]);
                        var liText = document.createTextNode(row['id']+ " || "+row['day']+" "+month[row['month']]+" "+row['year']+" "+row['value']+" "+row['desc']+" "+row['balance']);
                        li.appendChild(liText);
                        document.getElementById("database").appendChild(li);
                    }
                    updateStatus("Table 'myIO_DB' is present"); // added on version 3
                }, function(transaction, error){
                    updateStatus("Error: " + error.code + "<br>Message: " + error.message);
                });
            });
        }
        catch (e) {
            updateStatus("Error: unable to select myIO_DB from the db " + e + ".");
        }
    };
    
    var dropDB = function () { // DM-009, added on version 2
        var query = 'DROP TABLE myIO_DB;';
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [], nullDataHandler, errorHandler);
                updateStatus("Table 'myIO_DB' has been deleted");
                document.getElementById('database').innerHTML = "data has been deleted, new table is being created..."; // line updated on version 3
                checkDB(); // DM-010, added on version 3
            });
        }
        catch (e) {
            updateStatus("Error: unable to delete table 'myIO_DB' " + e + ".");
            return;
        }
    };
    
    errorHandler = function(transaction, error){
        updateStatus("Error: " + error.message);
        return true;
    };
    
    nullDataHandler = function(transaction, results){
    };
    
    function updateStatus(status){
        document.getElementById('status').innerHTML = status;
    };
    
    function cancel(){ // added on version 4
        var s = window.location.href;
        s = s.substring(0, s.indexOf('#'));
        window.location = s;
    }
    
    var renderMonths = function () { // DM-003, added on version 3
        var query = 'SELECT * FROM myIO_DB WHERE id=1;';
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [], function(transaction, results){
                    for (var i = 0; i < results.rows.length; i++) {
                        var row = results.rows.item(i);
                        var view = $("#home-content");
                        view.empty();
                        var auxm = row['month'];
                        var y = row['year'];
                        var ul = $("<ul id=\"notes-list\" data-role=\"listview\" data-theme=\"c\"</ul>").appendTo(view);
                        for (i = 0; i < number_months; i++) {
                            $("<li>"
                              + "<a href=\"#days?monthId="+auxm+"\">"
                              + "<h3>"+month[auxm]+" "+y+"</h3>"
                              + "</a>"
                              + "</li>").appendTo(ul);
                            auxm++;
                            if (auxm === 12) {
                                auxm = 0;
                                y++;
                            }
                        }
                        $("<li data-theme=\"b\"><h3>status:</h3><p id=\"status\"></p></li>").appendTo(ul);
                        $("<li data-theme=\"b\"><h3>database:</h3><p id=\"database\"></p></li>").appendTo(ul);
                        ul.listview();
                        showData();
                    }
                }, function(transaction, error){
                    updateStatus("Error: " + error.code + "<br>Message: " + error.message);
                });
            });
        }
        catch (e) {
            updateStatus("Error: unable to select myIO_DB from the db " + e + ".");
        };
    };
    
    var renderDays = function (data) { // DM-004, added on version 4
        var u = $.mobile.path.parseUrl(data.options.fromPage.context.URL);
        var re = "^#" + "days";
        if (u.hash.search(re) !== -1) {
            var queryStringObj = queryStringToObject(data.options.queryString);
            var pageId = queryStringObj["monthId"];
            current_month = pageId;
            var tempDB = new Array();
            var query = 'SELECT * FROM myIO_DB WHERE month='+pageId+';';
            try {
                localDB.transaction(function(transaction){
                    transaction.executeSql(query, [], function(transaction, results){
                        for (var i = 0; i < results.rows.length; i++) {
                            var row = results.rows.item(i);
                            tempDB[i] = new Array();
                            tempDB[i][0] = row['day'];
                            tempDB[i][1] = row['value'];
                            tempDB[i][2] = row['desc'];
                            tempDB[i][3] = row['balance'];
                        }
                        var lastday = row['day'];
                        var view = $("#days-content");
                        view.empty();
                        document.getElementById("days_h").innerHTML = month[row['month']]+" "+row['year'];
                        var ul = $("<ul id=\"notes-list\" data-role=\"listview\" class=\"ui-grid-c\" data-theme=\"c\"></ul>").appendTo(view);
                        $("<li data-theme=\"b\" data-icon=\"false\" data-mini=\"true\">"
                          + "<a href=\"#\">"
                          + "<span class=\"ui-block-a\">day</span>"
                          + "<span class=\"ui-block-b\">value (&pound)</span>"
                          + "<span class=\"ui-block-c\">description</span>"
                          + "<span class=\"ui-block-d\">balance (&pound)</span>"
                          + "</a>"
                          + "</li>").appendTo(ul);
                        for (i = 0; i < lastday; i++) {
                            $("<li>"
                              + "<a href=\"copy.html#edit?dayId="+(i+1)+"\">"
                              + "<span class=\"ui-block-a\">&nbsp;"+tempDB[i][0]+"</span>"
                              + "<span class=\"ui-block-b\">&nbsp;"+tempDB[i][1]+"</span>"
                              + "<span class=\"ui-block-c\">&nbsp;&nbsp;"+tempDB[i][2]+"</span>"
                              + "<span class=\"ui-block-d\">&nbsp;&nbsp;&nbsp;"+tempDB[i][3]+"</span>"
                              + "</a>"
                              + "</li>").appendTo(ul);
                        }
                        ul.listview();
                    }, function(transaction, error){
                        updateStatus("Error: " + error.code + "<br>Message: " + error.message);
                    });
                });
            }
            catch (e) {
                updateStatus("Error: unable to select myIO_DB from the db " + e + ".");
            };
        };
    };
    
    function renderForm(data){ // DM-005, added on version 5
        var u = $.mobile.path.parseUrl(data.options.fromPage.context.URL);
        var re = "^#" + "edit";
        if (u.hash.search(re) !== -1) {
            var queryStringObj = queryStringToObject(data.options.queryString);
            var pageId = queryStringObj["dayId"];
            var query = 'SELECT * FROM myIO_DB WHERE day='+pageId+' and month='+current_month+';';
            try {
                localDB.transaction(function(transaction){
                    transaction.executeSql(query, [], function(transaction, results){
                        for (var i = 0; i < results.rows.length; i++) {
                            var row = results.rows.item(i);
                        }
                        document.getElementById("edit_h").innerHTML = row['day']+" "+month[row['month']];
                        document.getElementById("value").value = row['value'];
                        document.getElementById("desc").value = row['desc'];
                        document.getElementById("balance").value = row['balance'];#
                    }, function(transaction, error){
                        updateStatus("Error: " + error.code + "<br>Message: " + error.message);
                    });
                });
            }
            catch (e) {
                updateStatus("Error: unable to select myIO_DB from the db " + e + ".");
            }
        };
    };
    
    var onPageBeforeChange = function (event, data) { // added on version 4
        if (typeof data.toPage === "string") {
            var url = $.mobile.path.parseUrl(data.toPage);
            if ($.mobile.path.isEmbeddedPage(url)) {
                data.options.queryString = $.mobile.path.parseUrl(url.hash.replace(/^#/, "")).search.replace("?", "");
            }
        }
    };
    
    var onPageChange = function (event, data) { // added on version 3
        var toPageId = data.toPage.attr("id");
        var fromPageId = null; // added on version 4
        if (data.options.fromPage) { // added on version 4
            fromPageId = data.options.fromPage.attr("id");
        }
        switch (toPageId) {
            case "home": renderMonths(); break; // DM-003, added on version 3
            case "days": // DM-004, added on version 4
                if (fromPageId === "home") {
                    renderDays(data);
                } break;
            case "edit": // DM-005, added on version 5
                if (fromPageId === "days") {
                    renderForm(data);
                } break;
        }
    };
    
    var queryStringToObject = function (queryString) { // added on version 4
        var queryStringObj = {};
        var e;
        var a = /\+/g;
        var r = /([^&;=]+)=?([^&;]*)/g;
        var d = function (s) { return decodeURIComponent(s.replace(a, " ")); };
        e = r.exec(queryString);
        while (e) {
            queryStringObj[d(e[1])] = d(e[2]);
            e = r.exec(queryString);
        }
        return queryStringObj;
    };
    
    var init = function () {
        var d = $(document);
        d.bind("pagebeforechange", onPageBeforeChange); // added on version 4
        d.bind("pagechange", onPageChange); // added on version 3
        d.delegate("#bt_reset", "tap", dropDB); // DM-009, added on version 2
        d.delegate("#bt_home", "tap", cancel); // added on version 4
        checkDB();
    };
    
    var public = {
        init: init
    };
    
    return public;

})(jQuery);

$(document).bind("mobileinit", function () {
    myIO.controller.init();
});
