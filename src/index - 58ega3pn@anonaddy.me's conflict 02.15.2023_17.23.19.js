import { v4 as uuid } from 'uuid'
import "./styles/styles.css";
import profileImage from './assets/anonProfileIconGrey.svg'
import settingsIcon from './assets/settingsGrey.svg'
import gogodoLogo from './assets/gogodoLogoCyan.svg'
import tabIcon from './assets/checkMark.svg'
import addBtn from './assets/addBtnCyan.svg'
const dateFns = require('date-fns')

let task = createTask("Task name");
let taskList = document.getElementById("mainTaskList");
let taskItem = document.createElement("div");


function createTask(title) {
    return {
        // not visible to the user
        uuid: uuid(),
        parent: undefined,
        child: undefined,
        collapseNode: false,
        title: title,
        startDate: dateFns.addHours(dateFns.startOfDay(new Date()), 8),
        dueDate: dateFns.addDays(dateFns.addHours(dateFns.startOfDay(new Date()), 18), 7),
        priorityLevel: 1, // 1 to 5
        progress: 0,
        infoBtnActive: false,
        // Info windows
        // scope: undefined, // estimated hours or work (NA)
        // archive: false,
        // delete: false,
        // complete: false,
    }
}

console.log(createTask())
console.log(createTask('Hello Hi There! Test!'))


// taskItem.textContent = task.title;
// taskItem.setAttribute("id", task.uuid);
// let deleteBtn = document.createElement("button");
// deleteBtn.textContent = "Delete";
// deleteBtn.classList.add("delete-btn");
// taskItem.appendChild(deleteBtn);
// taskList.appendChild(taskItem);

// For later user implementation\
// Undo
// nodeOwner: undefined, // define the user who owns this tasks and the responsibilities
// Time Map for visual project-planning
// resourcePath: 'optional resource path',
// dependencies: undefined, // dependents on all child nodes and potentially other nodes
// readPermission: undefined, // define users who have permission to read this task
// writePermission: undefined, // define users who have permission to edit or add items
// deletePermission: undefined, // define users who have permission to delete to this task
// readAccess: undefined, //  all children of the task
// function newUser(name) {
//     return {
//         officeHoursStart: undefined,
//         officeHoursEnd: undefined,
//         officeDays: undefined,
//         workingOn: undefined,
//         flowStatus: undefined,
//     }
// }
