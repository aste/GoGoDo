
import "./styles/styles.css";
const dateFns = require('date-fns')


// console.log('Hello there')

function setNewTime(timeArr) {
    let date = new Date()
    if (!timeArr) {
        date.setHours(20, 0, 0, 0)
    } else {
        date.setFullYear([timeArr][0])
        date.setHours([timeArr][1])
    }
    return date
}

function createNode(title) {
    console.log(title)
    return {
        title: title,
        startDate: setNewTime(),
        dueDate: setNewTime(),
    }
}

createNode("first todo item")
setNewTime()