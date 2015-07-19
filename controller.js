// MyIO version 2 - covering: DM-008, DM-009

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
                updateStatus("Table 'myIO_DB' is present");
                document.getElementById('database').innerHTML = ""; // added on version 2
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
                    showData();
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
                document.getElementById('database').innerHTML = "Empty!";
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
    
    var init = function () {
        var d = $(document);
        d.delegate("#bt_reset", "tap", dropDB); // DM-009, added on version 2
        d.delegate("#bt_new", "tap", checkDB); // added on version 2
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
