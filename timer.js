let interval = null;
let startTime = null;
let endTime = null;
let timesHistory = [];
let decAcc = 2;
let scoreSize = 5;

function renderRecordTime() {
  let bestTimeList = $('#best-times'),
    lastTimeList = $('#last-times');

  bestTimeList.empty();
  let bestTimes = timesHistory.slice().sort((a, b) => b - a).slice(0, scoreSize)
  bestTimes.forEach((v, i) => bestTimeList.append($(`<tr>
              <td>${i + 1}</div>
              <td class="text-end">${msToTime(v)}</div>
            </tr>`)));
  while(bestTimeList.children().length < scoreSize) {
      bestTimeList.append($(`<tr><td colspan='2' class='text-center'>---</td></tr>`));
  }

  lastTimeList.empty();
  timesHistory.slice(-scoreSize).forEach((v, i) => lastTimeList.append($(`<tr>
              <td>${i + 1}</div>
              <td class="text-end">${msToTime(v)}</div>
            </tr>`)));
  
  while(lastTimeList.children().length < scoreSize) {
      lastTimeList.append($(`<tr><td colspan='2' class='text-center'>---</td></tr>`));
  }
}

$(document).on("keydown", function(e) {
  switch (e.keyCode) {
    case 32:
      e.preventDefault();
      toggleTimer();
      break;
    case 13:
      e.preventDefault();
      recordTime();
      break;
  }
});

$(document).on('click', '[data-action="start"]', function() {
  toggleTimer();
});

$(document).on('click', '[data-action="pause"]', function() {
  toggleTimer();
});

$(document).on('click', '[data-action="reset"]', function() {
  resetTimer();
});

$(document).on('click', '[data-action="lap"]', function() {
  recordTime();
});

$(document).on('change', '#decimal-acc', function() {
  let acc = parseInt($(this).val());
  if (acc >= 0 && acc <= 3) {
    decAcc = acc;
    renderRecordTime();
  }
});

$(document).on('change', '#score-size', function() {
  let acc = parseInt($(this).val());
  if (acc >= 0) {
    scoreSize = acc;
    renderRecordTime();
  }
});

$(document).ready(renderRecordTime);

function renderBestTime(e) {
  return `<tr>
              <td>X</div>
              <td>${msToTime(e)}</div>
            </tr>`
}

function recordTime() {
  if (!startTime) {
    return;
  }

  timesHistory.push(getElapsedTime());
  startTime = new Date();

  renderRecordTime();

  if ($("#continue-timer").is(":checked")) {
    if (interval === null) {
      toggleTimer();
    }
  } else {
    resetTimer();
  }
}

function getElapsedTime() {
  if (!startTime) {
    return 0;
  }
  if (endTime) {
    return endTime - startTime;
  }
  return new Date() - startTime;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  startTime = null;
  endTime = null;
  $('[data-action="start"]').prop('disabled', false);
  $('[data-action="reset"]').prop('disabled', true);
  $('[data-action="pause"]').prop('disabled', true);
  let timer = $('#timer'),
    val = timer.find('.value');
  val.text(msToTime(0));
}

function toggleTimer() {
  $('[data-action="start"]').prop('disabled', interval == null);
  $('[data-action="reset"]').prop('disabled', false);
  $('[data-action="pause"]').prop('disabled', interval !== null);
  $('[data-action="pause"]').prop('disabled', interval !== null);
  if (interval === null) {
    if (endTime && startTime) {
      startTime = new Date(Date.parse(new Date()) - getElapsedTime());
    } else {
      startTime = new Date();
    }
    endTime = null;
    interval = setInterval(updateDisplay, 1);
  } else {
    clearInterval(interval);
    interval = null;
    endTime = new Date();
    updateDisplay();
  }
}

function updateDisplay() {
  let timer = $('#timer'),
    val = timer.find('.value');
  val.text(msToTime(getElapsedTime()));
}

function msToTime(duration) {
  let minutes = parseInt((duration / (1000 * 60)) % 60),
    seconds = (duration % 60000) / 1000;

  minutes = (minutes < 10) ? "0" + minutes : minutes;
  let secondsAndMiliseconds = seconds.toLocaleString(
    undefined,
    {
      minimumFractionDigits: decAcc,
      maximumFractionDigits: decAcc
    });
  secondsAndMiliseconds = (seconds < 10) ? "0" + secondsAndMiliseconds : secondsAndMiliseconds;

  return minutes + ":" + secondsAndMiliseconds;
}
