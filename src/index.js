// Dependencies
import { v4 as uuid } from 'uuid'
import "./styles/styles.css";
const dateFns = require('date-fns')

// Assets
import profileImage from './assets/anonProfileIconGrey.svg'
import settingsIcon from './assets/settingsGrey.svg'
import gogodoLogo from './assets/gogodoLogoCyan.svg'
import tabIcon from './assets/checkMark.svg'
import addBtn from './assets/addBtnCyan.svg'
import infoBtn from './assets/info.svg'

// Navigation Bar
const collapsedClass = "navCollapsed";
const nav = document.querySelector(".nav")
const navBorder = nav.querySelector(".navBorder")

navBorder.addEventListener('click', () => {
    nav.classList.toggle(collapsedClass);
    if (navBorder.innerHTML === '→') {
        navBorder.innerHTML = '←'
    } else { navBorder.innerHTML = '→' }
})


// ToDo Nodes
const rootList = []
const mainList = document.getElementById("mainList");
const forms = document.querySelectorAll(".nodeForm");
const newTaskBtn = document.getElementById('newTaskBtn')


function createNodeObject(nodeTitle) {
    return {
        uuid: uuid(),
        collapseNode: false,
        nodeTitle: nodeTitle,
        dueDate: dateFns.addDays(dateFns.addHours(dateFns.startOfDay(new Date()), 18), 7),
        priorityLevel: "H",
        projectManager: "You",
        indentationLevel: 0,
        complete: false,
        parent: undefined,
        children: [],
    }
}


function createNodeElement(node) {
    const nodeElement = document.createElement('div');
    nodeElement.id = node.uuid;
    console.log(`node.uuid: ${node.uuid}`)
    nodeElement.classList.add('node');

    const triangleElement = document.createElement('div');
    triangleElement.classList.add('triangleRight');
    nodeElement.appendChild(triangleElement);

    const nodeContainerElement = document.createElement('div');
    nodeContainerElement.classList.add('nodeContainer');
    nodeElement.appendChild(nodeContainerElement);

    const formElement = document.createElement('form');
    formElement.classList.add('nodeForm');
    nodeContainerElement.appendChild(formElement);

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.classList.add('nodeTitle');
    inputElement.placeholder = 'Add title..';
    formElement.appendChild(inputElement);

    const nodeMenuElement = document.createElement('div');
    nodeMenuElement.classList.add('nodeMenu');
    nodeContainerElement.appendChild(nodeMenuElement);

    const dueDateBtn = document.createElement('button');
    dueDateBtn.classList.add('nodeBtn', 'dueDate');
    dueDateBtn.title = `Due ${dateFns.format(node.dueDate, 'MMMM do yyyy')}`;
    dueDateBtn.textContent = dateFns.format(node.dueDate, 'do MMM');
    nodeMenuElement.appendChild(dueDateBtn);

    const priorityBtn = document.createElement('button');
    priorityBtn.classList.add('nodeBtn', 'nodePriority');
    priorityBtn.title = 'High Priority';
    priorityBtn.textContent = node.priorityLevel;
    nodeMenuElement.appendChild(priorityBtn);

    const ownerBtn = document.createElement('button');
    ownerBtn.classList.add('nodeBtn', 'nodeOwner');
    ownerBtn.title = 'You are the manager';
    const ownerImg = document.createElement('img');
    ownerImg.src = './anonProfileIconGrey.svg';
    ownerImg.alt = 'Profile Icon';
    ownerBtn.appendChild(ownerImg);
    nodeMenuElement.appendChild(ownerBtn);

    return nodeElement;
}


const initiateAppendNewNode = () => {
    const node = createNodeObject('');
    const nodeElement = createNodeElement(node);
    mainList.appendChild(nodeElement);
}

newTaskBtn.addEventListener('click', (event) => {
    initiateAppendNewNode()
})
// renderTodoList(todoItems);
// // Form Submit

const addFormEvent = () => {
    forms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.initiateAppendNewNode()
        })
    })
}


// // Create the root node
// const rootNode = createNodeObject("My To-Do List");

// // Add child nodes
// const node1 = createNodeObject("Task 1");
// const node2 = createNodeObject("Task 2");
// const node3 = createNodeObject("Task 3");
// rootNode.children.push(node1, node2, node3);

// function renderTodoList(todoItems) {
//     const todoListContainer = document.getElementById("todo-list");
//     todoListContainer.innerHTML = "";

//     todoItems.forEach(item => {
//         const todoItemElement = `
//         <div class="todo-item">
//           <input type="checkbox" ${item.completed ? "checked" : ""}>
//           <span>${item.title}</span>
//         </div>
//       `;
//         todoListContainer.insertAdjacentHTML("beforeend", todoItemElement);
//     });
// }

// const todoItems = [
//     { title: "Do laundry", completed: false },
//     { title: "Buy groceries", completed: true },
//     { title: "Walk the dog", completed: false },
// ];






//


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
