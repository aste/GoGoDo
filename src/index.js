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
const mainNodeWrapper = document.getElementById("mainNodeWrapper");
const newTaskBtn = document.getElementById('newTaskBtn');

// ToDo Nodes
const rootObj = {
    title: 'rootObj',
    uuid: uuid(),
    parent: undefined,
    children: [],
}

const mainNode = document.createElement('div')
mainNode.id = rootObj.uuid
mainNode.classList.add('mainNode')
mainNodeWrapper.insertBefore(mainNode, newTaskBtn)

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
        parent: undefined,
        indentationLevel: 0,
    }
}

function distanceToRoot(nodeObject) {
    let distance = 0;
    if (nodeObject.parent) { distance += 1 + distanceToRoot(nodeObject.parent) }
    return distance
}

function insertNodeObject(nodeObject, parent = rootObj, index = parent.children.length) {
    nodeObject.parent = parent
    nodeObject.indentationLevel = distanceToRoot(nodeObject)
    parent.children.splice(index, 0, nodeObject)
}


// function findElementIndex(node, uuid) {
//     for (let i = 0; i < node.parent.children.length; i++) {
//         if (node.parent.children[i].uuid === uuid) {
//             return i
//         }
//     }
// }

console.log(mainNode)
console.log(rootObj)

newTaskBtn.addEventListener('click', (event) => {
    const newNode = createNodeObject('')
    console.log(newNode)

    insertNodeObject(newNode)
    console.log(newNode)
    console.log(rootObj)

    clearSubTree(rootObj)
    console.log(rootObj)
    console.log(mainNode)

    renderSubTree(rootObj)
    console.log(rootObj)
})


// Initial Test nodes
const firstObj = createNodeObject('1 A life well lived')
insertNodeObject(firstObj)

const secondObj = createNodeObject('2 Help others live a better life')
insertNodeObject(secondObj, firstObj)

const thirdObj = createNodeObject('3 Leave the world better than you found it')
insertNodeObject(thirdObj, firstObj, 0)

const fourthObj = createNodeObject('4 Another quote')
insertNodeObject(fourthObj, undefined, 1)

const fifthObj = createNodeObject('5 ...')
insertNodeObject(fifthObj, firstObj)






// Render to DOM
function renderNode(node) {
    // if (node.title === 'rootObj') { return }
    const nodeElement = document.createElement('div');
    nodeElement.id = node.uuid;
    nodeElement.classList.add('node');

    const triangleElement = document.createElement('div');
    triangleElement.classList.add('triangleRight');
    triangleElement.style.setProperty('grid-column-start', `${node.indentationLevel}`)
    triangleElement.style.setProperty('grid-column-end', `${node.indentationLevel + 1}`)
    nodeElement.appendChild(triangleElement);

    const nodeContainerElement = document.createElement('div');
    nodeContainerElement.classList.add('nodeContainer');
    nodeContainerElement.style.setProperty('grid-column-start', `${node.indentationLevel + 1}`)
    nodeElement.appendChild(nodeContainerElement);

    const formElement = document.createElement('form');
    formElement.classList.add('nodeForm');

    formElement.addEventListener('submit', function (event) {
        event.preventDefault();
        const parent = node.parent
        const index = findNodeIndex(node, inputElement.dataset.uuid)
        appendNewNode('', parent, index);
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

function clearSubTree(parentObject) {
    const element = document.getElementById(parentObject.uuid)
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function renderSubTree(parentObject) {
    let element

    if (parentObject.uuid !== rootObj.uuid) {
        element = document.getElementById(parentObject.uuid)
    } else {
        element = document.getElementById(parentObject.uuid)
    }

    parentObject.children.forEach(childObject => {
        const childElement = renderNode(childObject);
        console.log(element)
        console.log(element.className)
        if (element.className === 'mainNode') {
            element.appendChild(childElement);
        } else {
            element.parentElement.appendChild(childElement);
        }

        if (childObject.children.length > 0) {
            renderSubTree(childObject);
        }
    })
}


renderSubTree(rootObj);