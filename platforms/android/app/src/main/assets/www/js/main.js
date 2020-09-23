document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

  document.addEventListener("backbutton", onBackKeyDown, false);

  function onBackKeyDown() {
    if (currentTab !== 0) {
      nextPrev(-1);
    }
  }

  //Создание БД

  var db = window.sqlitePlugin.openDatabase({
    name: "main.db",
    location: 'default'
  });
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS answers (id INTEGER NOT NULL PRIMARY KEY, date TEXT NOT NULL, slujba TEXT, grk TEXT, podr TEXT, dolj TEXT, pol TEXT, age TEXT, prich TEXT, staj TEXT, q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER, q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER, q11 INTEGER, q12 INTEGER, q13 INTEGER, q14 INTEGER, q15 INTEGER, q16 INTEGER, q17 INTEGER, q18 INTEGER, q19 INTEGER, q20 INTEGER, q21 INTEGER, q22 INTEGER, q23 INTEGER, q24 INTEGER, q25 INTEGER, q26 INTEGER, q27 INTEGER, q28 INTEGER, q29 INTEGER, q30 INTEGER, q31 INTEGER, q32 INTEGER, q33 INTEGER, q34 INTEGER, q35 INTEGER, q36 INTEGER, q37 INTEGER, q38 INTEGER, q39 INTEGER, q40 INTEGER, q41 INTEGER, q42 INTEGER, q43 INTEGER, q44 INTEGER)');
  }, function (error) {
    console.log('Transaction ERROR: ' + error.message);
  }, function () {
    console.log('Populated database OK');
  });

  //Создание страниц с вопросами

  var queArr = Object.values(que);
  for (i = 0; i < queArr.length; i++) {
    //for (i = 0; i < 2; i++) {  //Ограничение количества вопросов
    $('.tab:last').after('<div class="tab"></div>');
    $('.step:last').after('<span class="step"></span>');
    $('.tab:last').append('<p><b>Вопрос ' + (i + 1) + '</b></p>');
    $('.tab:last').append('<table class="rb ques">');
    for (j = 0; j < queArr[i].length; j++) {
      $('.tab:last table.rb').append('<tr><td><input type="radio" id="' + (i + 1) + '_' + (j + 1) + '" name="' + (i + 1) + '" value="' + (4 - j) + '"><label for="' + (i + 1) + '_' + (j + 1) + '">' + queArr[i][j] + '</label></td></tr>');
    }
    $('.tab:last').append('</table>');
  }

  //Работа страниц формы

  var currentTab = 0;
  showTab(currentTab);

  function showTab(n) {

    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";

    if (n == 0) {
      document.getElementById("prevBtn").style.display = "none";
    } else {
      document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      document.getElementById("nextBtn").innerHTML = "Сохранить";
    } else {
      document.getElementById("nextBtn").innerHTML = "Далее";
    }

    fixStepIndicator(n)
  }

  //Переход между страницами

  function nextPrev(n) {

    var x = document.getElementsByClassName("tab");

    if (n == 1 && !validateForm()) return false;

    x[currentTab].style.display = "none";

    currentTab = currentTab + n;

    //Сохранение ответов в базу данных

    if (currentTab >= x.length) {

      var data = $('#regForm').serializeArray();
      var answers = [];
      var currentdate = new Date();

      function twoDigits(d) {
        if (0 <= d && d < 10) return "0" + d.toString();
        if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
        return d.toString();
      }
      var datetime = currentdate.getFullYear() + "-" + twoDigits(currentdate.getMonth() + 1) + "-" + twoDigits(currentdate.getDate()) + " " + twoDigits(currentdate.getHours()) + ":" + twoDigits(currentdate.getMinutes()) + ":" + twoDigits(currentdate.getSeconds());

      answers[0] = datetime;
      for (i = 0; i < data.length; i++) {
        answers[i + 1] = data[i].value;
      }

      db.transaction(function (tx) {
        tx.executeSql('INSERT INTO answers (date, slujba, grk, podr, dolj, pol, age, prich, staj, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26, q27, q28, q29, q30, q31, q32, q33, q34, q35, q36, q37, q38, q39, q40, q41, q42, q43, q44) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', answers);
      }, function (error) {
        console.log('Transaction ERROR: ' + error.message);
        db.close();
      }, function () {
        console.log('Add to database OK');
        db.close(function () {
          console.log('database is closed ok');
        });
        document.getElementById("regForm").submit();
        document.location.href = 'done.html';
      });
      return false;
    }

    showTab(currentTab);
    if (currentTab == 0) {
      $('#menu').show()
    } else {
      $('#menu').hide()
    }
  }

  //Проверка введенных данных

  function validateForm() {

    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");

    for (i = 0; i < y.length; i++) {
      if (y[i].type == 'radio') {
        var rname = y[i].getAttribute('name');
        if ($('input[name=' + rname + ']:checked').val() == undefined) {
          y[i].className += " invalid";
          valid = false;
        }
      } else {
        if (y[i].value == "") {
          y[i].className += " invalid";
          valid = false;
        }
      }
    }

    if (valid) {
      document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid;
  }

  function fixStepIndicator(n) {

    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }

    x[n].className += " active";
  }

  arguments.callee.nextPrev = nextPrev;
};
