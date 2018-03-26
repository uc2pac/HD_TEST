//cverjhvber

let nameInput = null,
  lastNameInput = null,

  previousData = {
    name: '',
    lastName: '',
    scrollPosition: {
      top: 0,
      left: 0
    }
  },
  data = {
    name: '',
    lastName: '',
    scrollPosition: {
      top: 0,
      left: 0
    }
  };


window.onload = function() {
  initialize();
};

function initialize() {
  nameInput = document.getElementById('input-name');
  lastNameInput = document.getElementById('input-last-name');

  lastNameInput.addEventListener('change', onLastNameChanged);
  nameInput.addEventListener('change', onNameChanged);

  lastNameInput.addEventListener('change', onLastNameChanged);
  lastNameInput.addEventListener('focusout', onLastNameAddEventToBuffer);
  nameInput.addEventListener('change', onNameChanged);
  nameInput.addEventListener('focusout', onNameAddEventToBuffer);

  window.addEventListener("scroll", scrollEnd);
}

function onLastNameChanged() {
  data.lastName = lastNameInput.value || '';
}

function addEvents (targetId, value) {
  var pageViewId = Session.getPageViewId();
  for (let i = 0; i < 4; i++) {
    let eventObject = Events.createEventObject(Events.type.EVENT, {
      targetId,
      value: value + i
    });
    EventBuffer.push(pageViewId, eventObject);
  }
}

function onLastNameAddEventToBuffer(e) {
  if (data.lastName !== previousData.lastName) {
    addEvents(e.target.id, data.lastName);
    previousData.lastName = data.lastName;
  }
}

function onNameAddEventToBuffer(e) {
  if (data.name !== previousData.name) {
    addEvents(e.target.id, data.name);
    previousData.name = data.name;
  }
}

function onNameChanged() {
  data.name = nameInput.value || '';
}

function scrollEnd(e) {
  let top = e.target.scrollTop,
    left = e.target.scrollLeft;
/*
  if (previousData.scrollPosition.top !== top && previousData.scrollPosition.left !== left) {
    let eventObject = Events.createEventObject(Events.type.SCROLL_END, {
      targetId: e.target.id,
      scrollPosition: {
        scrollTop: top,
        scrollLeft: left
      }
    });

    var pageViewId = Session.getPageViewId();
    EventBuffer.push(pageViewId, eventObject);

    previousData.scrollPosition = {
      scrollTop: top,
      scrollLeft: left
    };
  }*/
}

Function.prototype.debounce = function (wait, immediate) {
  var timeout,
    func = this;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
