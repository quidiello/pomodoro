var duration;

onmessage = function(e) {
  duration = e.data * 60;
  startTimer();
}

function startTimer() {
  console.log(duration);
  duration -= 1;
  postMessage(duration);
  setTimeout("startTimer()",100);
}
