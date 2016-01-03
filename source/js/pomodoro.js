var timerWorker;
var storage  = localStorage;

$(function() {
  Notification.requestPermission();

  /* update interface */
  updateInterfaceStorage();

  /* Change text for duration slider */
  $('#duration_slider').on('change', function() {
    var value = $(this).val();
    $('#duration').text(value + (value > 1 ? ' minutes' : 'minute'));
  });

  /* Play button */
  $('#play').on('click', function() {
    if ($('#task').val().length === 0) {
      showDialog({
        title: 'Error',
        text: 'The task field is required',
        positive: {
          title: 'Accept'
        }
      });
    } else {
      $('#primary').addClass("none");
      $('#current_task').removeClass("none");
      addStorage($('#task').val(), $('#duration_slider').val());
      startTimer();
    }
  });

  /* Create timerWorker */
  function startTimer() {
    if (typeof(Worker) !== undefined) {
      timerWorker = new Worker("dist/js/timer.min.js");
      timerWorker.postMessage($('#duration_slider').val());

      timerWorker.onmessage = function(e) {

        var minutes = Math.floor(e.data / 60);
        var seconds = e.data % 60;
        var timer = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        $('#task_timer').text(timer);

        if (e.data === 0) {
          timerWorker.terminate();
          $('#aBreak').prop('disabled', false);
          showNotification($('#task').val(), "task");
        }
      };
    } else {
      window.alert("Este navegador no soporta workers.");
    }
  }

  /* break button */
  $('#aBreak').on('click', function() {
    $('#current_task').addClass("none");
    $('#break').removeClass("none");
    $('#aBreak').prop('disabled', true);
  });

  /* Change text for duration break slider */
  $('#break_slider').on('change', function() {
    var value = $(this).val();
    $('#breakDuration').text(value + (value > 1 ? ' minutes' : 'minute'));
  });

  /* Play button */
  $('#runBreak').on('click', function() {
    $('#break').addClass("none");
    $('#current_break').removeClass("none");
    startBreak();
  });

  /* Create timerWorker */
  function startBreak() {
    if (typeof(Worker) !== undefined) {
      timerWorker = new Worker("dist/js/timer.min.js");
      timerWorker.postMessage($('#break_slider').val());

      timerWorker.onmessage = function(e) {

        var minutes = Math.floor(e.data / 60);
        var seconds = e.data % 60;
        var timer = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        $('#break_timer').text(timer);

        if (e.data === 0) {
          timerWorker.terminate();
          $('#newTask').prop('disabled', false);
          showNotification("Break", "break");
        }
      };
    } else {
      window.alert("Este navegador no soporta workers.");
    }
  }

  /* newTask button */
  $('#newTask').on('click', function() {
    /* update interface */
    updateInterfaceStorage();

    $('#current_break').addClass("none");
    $('#primary').removeClass("none");
    $('#newTask').prop('disabled', true);
    $('#task').val('');
  });

  /* add task to localstorage */
  function addStorage(task, duration) {
    var object;
    if(storage.getItem(task) === null) {
      object = {'duration': duration, 'time': new Date()};
      storage.setItem(task, JSON.stringify(object));
    }
    else {
      object = JSON.parse(storage.getItem(task));
      object.duration = parseInt(object.duration) + parseInt(duration);
      object.time = new Date();
      storage.setItem(task, JSON.stringify(object));
    }
  }

  /* get storage data */
  function updateInterfaceStorage() {
    if(storage.length !== 0) {
      $('#record-container table tbody').empty();
      $('#taskList').empty();
      for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        var object = JSON.parse(storage.getItem(key));
        var date = new Date(object.time);
        var sDate = ((date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1 ) + '/' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' + date.getFullYear() + ', ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        $('#record-container table tbody').append('<tr><td class="mdl-data-table__cell--non-numeric">'+key+'</td><td>'+object.duration+'</td><td>'+sDate+'</td></tr>');
        $('#taskList').append('<option value = ' + key + '>');
      }
    }
  }

  function showNotification(task, type) {
    if(Notification.permission === "granted") {
      var title;
      var extra;
      if(type === "task") {
        title = task;
        extra = {
          icon: "/dist/img/prueba.png",
          body: "The task '" + task + "' has finished. You deserve a break!",
          vibrate: [300,100,300]
        };
      }
      else {
        title = "Break";
        extra = {
          icon: "/dist/img/breakLogo.jpg",
          body: "Your break has finished. Back to work!",
          vibrate: [300,100,300]
        };
      }
      var notification = new Notification(title, extra);
      setTimeout(function() {notification.close();}, 10000);
    }
  }

});
