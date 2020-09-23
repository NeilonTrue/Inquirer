	function index() {
	  document.location.href = 'index.html';
	}

	// Очистка базы данных

	function cleardb() {
	  function onConfirm(buttonIndex) {
	    if (buttonIndex == 1) {
	      var db = window.sqlitePlugin.openDatabase({
	        name: "main.db",
	        location: 'default'
	      });
	      db.transaction(function (tx) {
	        tx.executeSql('DELETE FROM answers');
	      }, function (error) {
	        console.log('Transaction ERROR: ' + error.message);
	        db.close();
	      }, function () {
	        console.log('Delete data from database OK');
	        db.close(function () {
	          console.log('database is closed ok');
	        });
	      });

	      function dbalert() {
	        console.log('Pressed Ok');
	      }
	      navigator.notification.alert('База данных очищена', dbalert, '', 'Ок');
	    }
	  }
	  navigator.notification.confirm('Очистить базу данных на устройстве?', onConfirm, '', ['Да', 'Нет']);
	}

	//Сохранение файла

	function savefile() {
	  function onSave() {
	    var data = [];
	    var db = window.sqlitePlugin.openDatabase({
	      name: "main.db",
	      location: 'default'
	    });
	    db.transaction(function (tx) {
	      tx.executeSql('SELECT date, slujba, grk, podr, dolj, pol, age, prich, staj, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26, q27, q28, q29, q30, q31, q32, q33, q34, q35, q36, q37, q38, q39, q40, q41, q42, q43, q44 FROM answers', [], success)
	    }, function (error) {
	      console.log('Transaction ERROR: ' + error.message);
	      db.close();
	    }, function () {
	      console.log('Select OK');
	      db.close(function () {
	        console.log('database is closed ok')
	      })
	    });

	    function success(tx, result) {
	      var len = result.rows.length;
	      console.log('Rows: ' + len);
	      for (var i = 0; i < len; i++) {
	        var row = result.rows.item(i);
	        data.push(row);
	      }

	      var dataJSON = JSON.stringify(data);
	      var csv = "\ufeff" + Papa.unparse(dataJSON, {
	        delimiter: ";",
	        header: false,
	        encoding: "UTF-8"
	      });

	      var currentdate = new Date();
	      var filename = currentdate.getDate() + "." + (currentdate.getMonth() + 1) + "." + currentdate.getFullYear() + "_" + currentdate.getHours() + "-" + currentdate.getMinutes() + "-" + currentdate.getSeconds() + ".csv";

	      window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dir) {
	        dir.getFile(filename, {
	          create: true
	        }, function (file) {
	          var csvFile = file;
	          csvFile.createWriter(function (fileWriter) {
	            fileWriter.seek(fileWriter.length);
	            var blob = new Blob([csv], {
	              type: 'text/plain'
	            });
	            fileWriter.write(blob);
	            console.log("file writted");
	          });
	        });
	      });
	    }
	  }
	  navigator.notification.alert('Файл сохранен в корневой папке устройства', onSave, '', 'Ок');
	}

	//Загрузка данных на сервер

	function upload() {
	  var data = [];
	  var db = window.sqlitePlugin.openDatabase({
	    name: "main.db",
	    location: 'default'
	  });
	  db.transaction(function (tx) {
	    tx.executeSql('SELECT date, slujba, grk, podr, dolj, pol, age, prich, staj, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26, q27, q28, q29, q30, q31, q32, q33, q34, q35, q36, q37, q38, q39, q40, q41, q42, q43, q44 FROM answers', [], success)
	  }, function (error) {
	    console.log('Transaction ERROR: ' + error.message);
	    db.close();
	  }, function () {
	    console.log('Select OK');
	    db.close(function () {
	      console.log('database is closed ok')
	    })
	  });

	  function success(tx, result) {
	    var len = result.rows.length;
	    console.log('Rows: ' + len);
	    for (var i = 0; i < len; i++) {
	      var row = result.rows.item(i);
	      data.push(row);
	    }

	    var dataJSON = JSON.stringify(data);

	    $.ajax({
	      type: 'POST',
	      url: 'http://localhost/upload.php',
	      contentType: 'application/json',
	      data: dataJSON,
	      success: function (data) {
	        console.log(data);
	        navigator.notification.confirm(data + '\n\nУдалить данные с устройства?', onConfirm, '', ['Да', 'Нет']);

	        function onConfirm(buttonIndex) {
	          if (buttonIndex == 1) {
	            var db = window.sqlitePlugin.openDatabase({
	              name: "main.db",
	              location: 'default'
	            });
	            db.transaction(function (tx) {
	              tx.executeSql('DELETE FROM answers');
	            }, function (error) {
	              console.log('Transaction ERROR: ' + error.message);
	              db.close();
	            }, function () {
	              console.log('Delete data from database OK');
	              db.close(function () {
	                console.log('database is closed ok');
	              });
	            });

	            function dbalert() {
	              console.log('Pressed Ok');
	            }
	            navigator.notification.alert('Данные удалены', dbalert, '', 'Ок');
	          }
	        }
	      },
	      error: function (jqXHR, exception) {
	        var msg = '';
	        if (jqXHR.status === 0) {
	          msg = 'Not connect.\n Verify Network.';
	        } else if (jqXHR.status == 404) {
	          msg = 'Requested page not found. [404]';
	        } else if (jqXHR.status == 500) {
	          msg = 'Internal Server Error [500].';
	        } else if (exception === 'parsererror') {
	          msg = 'Requested JSON parse failed.';
	        } else if (exception === 'timeout') {
	          msg = 'Time out error.';
	        } else if (exception === 'abort') {
	          msg = 'Ajax request aborted.';
	        } else {
	          msg = 'Uncaught Error.\n' + jqXHR.responseText;
	        }
	        console.log(msg);
	      }
	    });
	  }
	}
