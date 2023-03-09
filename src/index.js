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

// DOM References
const mainList = document.getElementById("mainList");
const newTaskBtn = document.getElementById('newTaskBtn');
// const forms = document.querySelectorAll(".nodeForm");

// ToDo Nodes
const rootList = {
    title: 'Root List',
    uuid: uuid(),
    parent: undefined,
    children: [],

}



function createNodeObject(title) {
    return {
        title: title,
        uuid: uuid(),
        dueDate: dateFns.addDays(dateFns.addHours(dateFns.startOfDay(new Date()), 18), 7),
        priorityLevel: "H",
        projectManager: "You",
        collapseNode: false,
        complete: false,
        children: [],
        parent: parent,
        indentationLevel: 0,
    }
}


function insertNodeObject(nodeObject, parent = rootList, index = parent.children.length) {
    nodeObject.parent = parent
    parent.children.splice(index, 0, nodeObject)
    // const node1 = createNodeObject('A life well lived')
    // insertNodeObject(node1, rootList, 0)
    // const node2 = createNodeObject('Help others live a better life')
    // insertNodeObject(node2, node1, 0)
}

const distanceToRootNode = (node) => {
    let distance = 0;
    if (node.parent) {
        distance += 1 + distanceToRootNode(node.parent)
    }
    return distance
}

function findNodeIndex(node, uuid) {
    for (let i = 0; i < node.parent.children.length; i++) {
        if (node.parent.children[i].uuid === uuid) {
            return i
        }
    }
}

function findNodeParent(node) { }


function appendNewNode(title, parent = rootList, index = parent.children.length) {
    const node = createNodeObject(title);
    insertNodeObject(node, parent, index)

    // const nodeElement = renderNodeElement(node);
    // mainList.appendChild(nodeElement);

}

newTaskBtn.addEventListener('click', (event) => {
    appendNewNode('')
    console.log(rootList)
})

appendNewNode('A life well lived')
appendNewNode('Help others live a better life')
appendNewNode('Leave the world better than you found it')
appendNewNode('')

// console.log(rootList)

for (let i = 0; i < rootList.children.length; i++) {
    console.log(`at index: ${i}`);
    console.log(rootList.children[i]);
    console.log('');
}

function renderNodeTree(node) {
    for (let i = 0; node.parent.children.length > i; i++) {
        renderNodeElement(node)
    }
}

// Render to DOM
function renderNodeElement(node) {
    const nodeElement = document.createElement('div');
    nodeElement.id = node.uuid;
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
        // console.log(inputElement.dataset.uuid)
        const parent = node.parent
        const index = findNodeIndex(node, inputElement.dataset.uuid)
        console.log(inputElement.dataset.uuid)
        console.log(index)
        console.log(mainList[index])
        console.log(node)
        appendNewNode('', parent, index);
        // event.target(this.nextSibling)
    })
    nodeContainerElement.appendChild(formElement);

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.classList.add(`title`);
    inputElement.placeholder = 'Add title..';
    inputElement.value = node.title;
    inputElement.dataset.uuid = node.uuid
    inputElement.addEventListener('input', (event) => {
        node.title = event.target.value
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
