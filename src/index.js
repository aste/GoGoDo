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


// Node Objects
const rootObj = {
    title: 'rootObj',
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
        parent: undefined,
        indentationLevel: 0,
    }
}

function distanceToRoot(nodeObject) {
    let distance = 0;
    if (nodeObject.parent) { distance += 1 + distanceToRoot(nodeObject.parent) }
    return distance
}

function insertNodeObject(node, parent = rootObj, index = parent.children.length) {
    if (node.parent) { node.parent.children.splice(findNodeIndex(node), 1) }
    node.parent = parent
    node.indentationLevel = distanceToRoot(node)
    parent.children.splice(index, 0, node)
}

const findNodeIndex = (node) => node.parent.children.indexOf(node)

function updateNodeAndChildrenIndentLvl(parentNode) {
    for (const child of parentNode.children) {
        child.indentationLevel = distanceToRoot(child)
        if (child.children) {
            updateNodeAndChildrenIndentLvl(child)
        }
    }
}

function unIndentNode(node) {
    // if (node.parent.uuid !== rootObj.uuid) {
    //     const newParent = node.parent.parent
    //     const parentIndexInGrandparent = findNodeIndex(node.parent)
    //     insertNodeObject(node, newParent, parentIndexInGrandparent + 1)
    //     updateNodeAndChildrenIndentLvl(node)
    // }
    if (node.parent !== undefined && node.parent.parent !== undefined) {
        const newParent = node.parent.parent;
        const parentIndexInGrandparent = findNodeIndex(node.parent);
        insertNodeObject(node, newParent, parentIndexInGrandparent + 1);
        updateNodeAndChildrenIndentLvl(node);
    }
}

function indentNode(node) {
    if (findNodeIndex(node) != 0) {
        const prevSibling = node.parent.children[findNodeIndex(node) - 1]
        insertNodeObject(node, prevSibling)
        updateNodeAndChildrenIndentLvl(node)
    }
}


// DOM References
const mainNodeWrapper = document.getElementById("mainNodeWrapper");
const newTaskBtn = document.getElementById('newTaskBtn');


// DOM Elements
const collapsedClass = "navCollapsed";
const nav = document.querySelector(".nav")
const navBorder = nav.querySelector(".navBorder")

navBorder.addEventListener('click', () => {
    nav.classList.toggle(collapsedClass);
    if (navBorder.innerHTML === '→') {
        navBorder.innerHTML = '←'
    } else { navBorder.innerHTML = '→' }
})

const mainNode = document.createElement('div')
mainNode.id = rootObj.uuid
mainNode.classList.add('mainNode')
mainNodeWrapper.insertBefore(mainNode, newTaskBtn)


// DOM Manipulation

function renderNode(node) {
    // if (node.title === 'rootObj') { return }
    const nodeElement = document.createElement('div');
    nodeElement.id = node.uuid;
    nodeElement.classList.add('node');
    nodeElement.dataset.indentlvl = node.indentationLevel

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
    formElement.dataset.uuid = node.uuid
    formElement.addEventListener('keydown', function (event) { moveFocus(event) })
    formElement.addEventListener('keydown', function (event) { indentDomNode(event) })
    formElement.addEventListener('keydown', function (event) { moveDomNode(event) })
    formElement.addEventListener('submit', function (event) {
        event.preventDefault();
        // Insert New Obj Node in Data Tree
        const newNode = createNodeObject('')
        insertNodeObject(newNode, node.parent, findNodeIndex(node) + 1)

        // Update Dom
        const newDomNode = renderNode(newNode)
        const currentDomNode = document.getElementById(formElement.dataset.uuid)
        appendDomNodeBeforeNextSibling(currentDomNode, newDomNode)
        moveFocusTo(newNode.uuid)
    })
    nodeContainerElement.appendChild(formElement);

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.classList.add(`title`);
    inputElement.placeholder = 'Add title..';
    inputElement.value = node.title;
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

function moveFocusTo(uuid) {
    const formElement = document.querySelector(`form[data-uuid="${uuid}"]`)
    const inputField = formElement.querySelector('input.title')
    inputField.focus()
}

function moveDomNode(event) {
    const inputField = event.target


}

function moveFocus(event) {
    const inputField = event.target;
    const currentDomNode = inputField.closest('.node');
    const previousDomNode = currentDomNode.previousElementSibling;
    const nextDomNode = currentDomNode.nextElementSibling;

    if (event.key === "ArrowDown") { // Down arrow key
        event.preventDefault();
        if (nextDomNode) {
            const nextInputField = nextDomNode.querySelector('.title');
            if (nextInputField) {
                nextInputField.focus();
            }
        }
    }
    if (event.key === "ArrowUp" && !event.commandkey) { // Up arrow key
        event.preventDefault();
        if (previousDomNode) {
            const previousInputField = previousDomNode.querySelector('.title');
            if (previousInputField) {
                previousInputField.focus();
            }
        }
    }
}


function indentDomNode(event) {
    const inputField = event.target;
    const currentDomNode = inputField.closest('.node');
    const currentIndentLevel = currentDomNode.getAttribute('data-indentlvl')
    const currentUuid = currentDomNode.getAttribute('id')
    const objNode = findNodeByUuid(currentUuid)

    if (event.key === "Tab" && !event.shiftKey && currentIndentLevel > 0) { // Down arrow key
        event.preventDefault();
        indentNode(objNode);
        clearDomTree();
        renderTree(rootObj);
        moveFocusTo(currentUuid)
    }

    if (event.key === "Tab" && event.shiftKey && currentIndentLevel > 1) { // Down arrow key
        event.preventDefault();
        unIndentNode(objNode)
        clearDomTree()
        renderTree(rootObj);
        moveFocusTo(currentUuid)
    }
}

function clearDomTree() {
    while (mainNode.firstChild) {
        mainNode.removeChild(mainNode.firstChild)
    }
}

function findNodeByUuid(uuid, node = rootObj) {
    if (node.uuid === uuid) return node;

    for (const child of node.children) {
        const foundNode = findNodeByUuid(uuid, child);
        if (foundNode) {
            return foundNode;
        }
    }

    return null;
}


function appendDomNodeBeforeNextSibling(currentDomNode, newDomNode) {
    const currentIndentLevel = currentDomNode.getAttribute('data-indentlvl')
    let nextSiblingFound = false

    for (let sibling = currentDomNode.nextElementSibling; sibling; sibling = sibling.nextElementSibling) {
        if (sibling.getAttribute('data-indentlvl') === currentIndentLevel) {
            currentDomNode.parentElement.insertBefore(newDomNode, sibling)
            nextSiblingFound = true;
            break;
        }
    }

    if (!nextSiblingFound) {
        currentDomNode.after(newDomNode)
    }
}



function renderTree(parentObject) {
    let element

    if (parentObject.uuid !== rootObj.uuid) {
        element = document.getElementById(parentObject.uuid)
    } else {
        element = document.getElementById(parentObject.uuid)
    }

    parentObject.children.forEach(childObject => {
        const childElement = renderNode(childObject);
        if (element.className === 'mainNode') {
            element.appendChild(childElement);
        } else {
            element.parentElement.appendChild(childElement);
        }
        if (childObject.children) {
            renderTree(childObject);
        }
    })
}


newTaskBtn.addEventListener('click', (event) => {
    const newNode = createNodeObject('')
    insertNodeObject(newNode)

    const newDomNode = renderNode(newNode)
    mainNode.appendChild(newDomNode)

    moveFocusTo(newNode.uuid)
})




// Initial Test nodes
const firstObj = createNodeObject('A life well lived')
insertNodeObject(firstObj)

const secondObj = createNodeObject('Help others live a better life')
insertNodeObject(secondObj, firstObj)

const thirdObj = createNodeObject('Leave the world better than you found it')
insertNodeObject(thirdObj, secondObj)

const fourthObj = createNodeObject('The next step if for you to figure out')
insertNodeObject(fourthObj, thirdObj)

const fifthObj = createNodeObject('Go ahead and make your plan')
insertNodeObject(fifthObj, thirdObj)

const sixthObj = createNodeObject('')
insertNodeObject(sixthObj)


// Render full tree
renderTree(rootObj);