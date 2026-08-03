const taskbar = document.getElementById('taskbar')
const taskAppContainer = document.getElementById('taskApps')

function updateTime() {
  const curDate = new Date(Date.now())
  var curTime = curDate.toLocaleString('en-us', { timezone: 'America/Indiana' })
  var splitTime = curTime.split(',')[1].split(':')

  var timeString = `${splitTime[0].trim()}:${splitTime[1]} ${splitTime[2].split(' ')[1]}`

  document.getElementById('timeSpan').textContent = timeString
}

function createAppBar(appName) {
  const template = document.getElementById('TaskbarApp.Template')
  const newTask = template.content.firstElementChild.cloneNode(true)
  newTask.querySelector('.taskbarText').textContent = appName

  taskAppContainer.appendChild(newTask)
  //   taskbar.insertBefore(newTask, taskbar.children[taskbar.children.length - 1])
  newTask.addEventListener('click', (e) => {
    openWindows.forEach((window) => {
      if (window.title == appName) {
        window.windowElement.classList.remove('hideAnim')
        window.windowElement.classList.add('unHideAnim')
      }
    })
    newTask.remove()
  })
}

updateTime()
setInterval(updateTime, 1000)
