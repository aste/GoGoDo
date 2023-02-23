import { v4 as uuid } from 'uuid'
import "./styles/styles.css";
import profileImage from './assets/anonProfileIconGrey.svg'
import settingsIcon from './assets/settingsGrey.svg'
import gogodoLogo from './assets/gogodoLogoCyan.svg'
import tabIcon from './assets/checkMark.svg'
import addBtn from './assets/addBtnCyan.svg'
import infoBtn from './assets/info.svg'
const dateFns = require('date-fns')

// Navigation Bar
const collapsedClass = "navCollapsed";
const nav = document.querySelector(".nav")
const navBorder = nav.querySelector(".navBorder")

navBorder.addEventListener('click', () => {
    console.log('its happening');
    nav.classList.toggle(collapsedClass);
    if (navBorder.innerHTML === '→') {
        navBorder.innerHTML = '←'
    } else { navBorder.innerHTML = '→' }
})

// let task = createTask("Task name");
const mainTaskList = document.getElementById("mainTaskList");
const forms = document.querySelectorAll(".nodeForm");
const taskItem = document.createElement("div");


// Factory Function for the To-Do Node Objects
function createNode(nodeTitle) {
    return {
        uuid: uuid(),
        collapseNode: false,
        nodeTitle: nodeTitle,
        dueDate: dateFns.addDays(dateFns.addHours(dateFns.startOfDay(new Date()), 18), 7),
        priorityLevel: "H",
        projectManager: "You",
        parent: undefined,
        children: [],
    }
}


// Form Submit
forms.forEach(form => {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        createNode()
    })
})





//


// console.log(createTask())
// console.log(createTask('Hello Hi There! Test!'))


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
