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


function renderNodeElement(node) {
    const nodeElement = document.createElement('div');
    nodeElement.id = node.uuid;
    // console.log(`node.uuid: ${node.uuid}`)
    nodeElement.classList.add('node');

    const triangleElement = document.createElement('div');
    triangleElement.classList.add('triangleRight');
    nodeElement.appendChild(triangleElement);

    const nodeContainerElement = document.createElement('div');
    nodeContainerElement.classList.add('nodeContainer');
    nodeElement.appendChild(nodeContainerElement);

    const formElement = document.createElement('form');
    formElement.classList.add('nodeForm');

    formElement.addEventListener('submit', function (event) {
        event.preventDefault();
        newNode('');
        // event.target(this.nextSibling)
    })
    nodeContainerElement.appendChild(formElement);

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.classList.add('nodeTitle');
    inputElement.placeholder = 'Add title..';
    inputElement.value = node.nodeTitle;
    inputElement.addEventListener('input', (event) => {
        node.nodeTitle = event.target.value
        console.log(node.nodeTitle)
        // node.nodeTitle = inputElement.value;
        // for (let i = 0; i < rootList.length; i++) {
        //     console.log(rootList[i]);
        // }
    })
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


function newNode(title) {
    const node = createNodeObject(title);
    const nodeElement = renderNodeElement(node);
    mainList.appendChild(nodeElement);
    rootList.push(node);
}


newTaskBtn.addEventListener('click', (event) => {
    newNode('')
})

newNode('A life well lived')
newNode('Help others live a better life')
newNode('Leave it better than your found it')
newNode('')


for (let i = 0; i < rootList.length; i++) {
    console.log(rootList[i]);
}