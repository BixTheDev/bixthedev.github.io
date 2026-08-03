var openWindows = [];
const desktop = document.getElementById("Desktop");
class OSWindow {
  constructor(title, windowElement) {
    this.title = title;
    this.windowElement = windowElement;
  }
  Close() {
    openWindows.splice(openWindows.indexOf(this), 1);
    this.windowElement.remove();
    console.log(`Closing ${this.title} Window`);
  }
  Minimize() {
    createAppBar(this.title);
    // this.windowElement.style.visibility = 'hidden'
    this.windowElement.classList.add("hideAnim");
    this.windowElement.classList.remove("unHideAnim");
  }
  Focus() {
    console.log(`Focusing - ${this.title} Window`);
    this.windowElement.style.zIndex = 2;
    openWindows.forEach((window) => {
      if (window.title != this.windowElement.dataset.title) {
        window.windowElement.style.zIndex = 1;
      }
    });
  }
}

function closeWindow(elementObj) {
  elementObj.Close();
}

function minimizeWindow(elementObj) {
  elementObj.Minimize();
}

function windowExist(title, maxCount) {
  console.log("Checking if window exists");
  var curCount = 0;
  openWindows.forEach((window) => {
    if (window.title == title) {
      curCount++;
    }
  });

  if (curCount >= parseInt(maxCount)) {
    return true;
  } else {
    return false;
  }
}

function createWindow(title, templateID) {
  console.log(`Creating new Window - ${title} > ${templateID}`);
  const template = document.getElementById(templateID);
  const windowEl = template.content.firstElementChild.cloneNode(true);
  windowEl.dataset.title = title;

  if (windowExist(title, windowEl.dataset.maxWindows)) {
    return;
  }
  desktop.appendChild(windowEl);
  makeDraggable(windowEl);
  const newWin = new OSWindow(title, windowEl);
  openWindows.push(newWin);

  // Add Controls to the exit button
  windowEl.querySelector("#exitButton").addEventListener("click", (e) => {
    closeWindow(newWin);
  });

  // Add controls to the minimize buttons
  windowEl.querySelector("#minimizeButton").addEventListener("click", (e) => {
    minimizeWindow(newWin);
  });

  windowEl.querySelectorAll(".icon").forEach((icon) => {
    icon.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
    });
  });
}

function setupApps() {
  const apps = Array.from(document.getElementsByClassName("application"));

  apps.forEach((app) => {
    if (!app.dataset.windowTemplate) {
      return;
    }
    const title = app.dataset.title;
    const winTemplate = app.dataset.windowTemplate;
    console.log(`Setting up ${title} application`);

    app.addEventListener("click", function () {
      createWindow(title, winTemplate);
    });
  });
}

function makeDraggable(windowElement, isWindow = true) {
  let offsetX = 0;
  let offsetY = 0;

  var handle = windowElement;
  if (isWindow) {
    handle = windowElement.children[0];
  }
  handle.addEventListener("pointerdown", (e) => {
    openWindows.forEach((window) => {
      if (window.title == windowElement.dataset.title) {
        window.Focus();
      }
    });

    offsetX = e.clientX - windowElement.offsetLeft;
    offsetY = e.clientY - windowElement.offsetTop;

    handle.setPointerCapture(e.pointerId);

    const move = (e) => {
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      // Keep inside viewport
      newX = Math.max(
        0,
        Math.min(newX, window.innerWidth - windowElement.offsetWidth),
      );
      newY = Math.max(
        0,
        Math.min(newY, window.innerHeight - windowElement.offsetHeight - 51),
      );

      windowElement.style.left = `${newX}px`;
      windowElement.style.top = `${newY}px`;
    };

    const up = (e) => {
      handle.releasePointerCapture(e.pointerId);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
    };

    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
  });
}

setupApps();
createWindow("Meet The Dev", "MTD.Template");

window.addEventListener("resize", () => {
  openWindows.forEach((window) => {
    window.Close();
  });
});
