import { v4 as uuid } from 'uuid'
import "./styles/styles.css";
import profileImage from './assets/anonProfileIconGrey.svg'
import settingsIcon from './assets/settingsGrey.svg'
import gogodoLogo from './assets/gogodoLogoCyan.svg'
import addBtn from './assets/addBtnCyan.svg'
const dateFns = require('date-fns')

let task = createTask("Task name");
let taskList = document.getElementById("mainTaskList");
let taskItem = document.createElement("div");

// taskItem.textContent = task.title;
// taskItem.setAttribute("id", task.uuid);
// let deleteBtn = document.createElement("button");
// deleteBtn.textContent = "Delete";
// deleteBtn.classList.add("delete-btn");
// taskItem.appendChild(deleteBtn);
// taskList.appendChild(taskItem);


function createTask() {
    return {
        collapseExpandNode: undefined, // collapse all children of the task
        uuid: uuid(),
        title: "Task title",
        description: "Task description",
        
        nodeOwner: undefined, // define the user who owns this tasks and the responsibilities
        startDate: dateFns.addHours(dateFns.startOfDay(new Date()), 8),
        dueDate: dateFns.addDays(dateFns.addHours(dateFns.startOfDay(new Date()), 18), 7),
        priorityLevel: 'High',
        scope: undefined, // estimated hours or work
        progress: 10,
        progressTracker: 5,
    }
}



console.log(createTask())




// for later user implementation
// Time Map for visual project-planning
// resourcePath: 'optional resource path',
// dependencies: undefined, // dependents on all child nodes and potentially other nodes
// readPermission: undefined, // define users who have permission to read this task
// writePermission: undefined, // define users who have permission to edit or add items
// deletePermission: undefined, // define users who have permission to delete to this task
// readAccess: undefined, // expand all children of the task
// function newUser(name) {
//     return {
//         officeHoursStart: undefined,
//         officeHoursEnd: undefined,
//         officeDays: undefined,
//         workingOn: undefined,
//         flowStatus: undefined,
//     }
// }
