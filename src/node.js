import { v4 as uuid } from "uuid";
import { parse, stringify } from 'flatted';
import { parseISO } from 'date-fns';
const dateFns = require('date-fns');

//DOM references
export const mainNode = document.createElement('div')
export const mainNodeWrapper = document.getElementById("mainNodeWrapper");
export const newTaskBtn = document.getElementById('newTaskBtn');

// Local Storage
export function saveDataToLocalStorage() {
    const dataToSave = stringify(rootObj);
    localStorage.setItem('rootObj', dataToSave);
}

export function loadDataFromLocalStorage() {
    const storedRootObj = localStorage.getItem('rootObj');
    if (storedRootObj === null) {
        return null;
    }
    return parse(storedRootObj);
}

export function updateRootObject(newRoot) {
    rootObj.children = newRoot.children;
}

// Node Objects
export const rootObj = {
    title: 'rootObj',
    uuid: uuid(),
    parent: undefined,
    children: [],
}

export function createNodeObject(title) {
    return {
        title: title,
        uuid: uuid(),
        dueDate: dateFns.addDays(dateFns.addHours(dateFns.startOfDay(new Date()), 18), 7),
        priorityLevel: "N",
        projectManager: "You are the manager",
        collapseNode: false,
        complete: false,
        hidden: false,
        childrenShown: true,
        children: [],
        parent: undefined,
        indentationLevel: 0,
    }
}

export function distanceToRoot(nodeObject) {
    let distance = 0;
    if (nodeObject.parent) { distance += 1 + distanceToRoot(nodeObject.parent) }
    return distance
}

export function insertNodeObject(node, parent = rootObj, index = parent.children.length) {
    if (node.parent) { node.parent.children.splice(findNodeIndex(node), 1) }
    node.parent = parent
    node.indentationLevel = distanceToRoot(node)
    parent.children.splice(index, 0, node)
    saveDataToLocalStorage()
}

export const findNodeIndex = (node) => node.parent.children.indexOf(node)

export function updateNodeAndChildrenIndentLvl(parentNode) {
    for (const child of parentNode.children) {
        child.indentationLevel = distanceToRoot(child)
        if (child.children) {
            updateNodeAndChildrenIndentLvl(child)
        }
    }
}

export function toggleComplete(node, parentComplete = null, shouldSave = true) {
    if (parentComplete === null) {
        node.complete = !node.complete;
    } else {
        node.complete = parentComplete;
    }

    node.children.forEach(child => toggleComplete(child, node.complete, false));

    if (shouldSave) { saveDataToLocalStorage(); }
}

export function hide(node, applyToParent = false, shouldSave = true) {
    if (applyToParent) {
        node.hidden = true
    } else {
        node.childrenShown = false
    }
    node.children.forEach(child => hide(child, true, true));

    if (shouldSave) { saveDataToLocalStorage(); }
}

export function show(node, applyToParent = false, shouldSave = true) {
    if (applyToParent) {
        node.hidden = false
    } else {
        node.childrenShown = true
    }
    node.children.forEach(child => show(child, true, true));

    if (shouldSave) { saveDataToLocalStorage(); }
}

export function deleteNode(node) {
    node.parent.children.splice(findNodeIndex(node), 1)
}

export function unIndentNode(node) {
    if (node.parent !== undefined && node.parent.parent !== undefined) {
        const newParent = node.parent.parent;
        const parentIndexInGrandparent = findNodeIndex(node.parent);
        insertNodeObject(node, newParent, parentIndexInGrandparent + 1);
        updateNodeAndChildrenIndentLvl(node);
    }
    saveDataToLocalStorage()
}

export function indentNode(node) {
    if (findNodeIndex(node) != 0) {
        const prevSibling = node.parent.children[findNodeIndex(node) - 1]
        insertNodeObject(node, prevSibling)
        updateNodeAndChildrenIndentLvl(node)
    }
    saveDataToLocalStorage()
}


// DOM Manipulation
export function renderNode(node) {

    const nodeElement = document.createElement('div');
    nodeElement.id = node.uuid;
    nodeElement.classList.add('node');
    nodeElement.classList.toggle('completed', node.complete);
    nodeElement.classList.toggle('hidden', node.hidden);
    nodeElement.dataset.indentlvl = node.indentationLevel

    const triangleElement = document.createElement('div');
    triangleElement.classList.add('triangle');
    triangleElement.classList.toggle('triangleDown', node.childrenShown);
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
    formElement.addEventListener('keydown', function (event) { toggleCompleteDomNode(event) })
    formElement.addEventListener('keydown', function (event) { deleteDomNode(event) })
    formElement.addEventListener('keydown', function (event) { collapseExpandDomNode(event) })
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

    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.classList.add('dueDateInput');

    if (typeof node.dueDate === 'string') { node.dueDate = parseISO(node.dueDate);}
    dueDateInput.value = dateFns.format(node.dueDate, 'yyyy-MM-dd');
    dueDateInput.title = `Due ${dateFns.format(node.dueDate, 'MMMM do yyyy')}`;
    dueDateInput.textContent = dateFns.format(node.dueDate, 'do MMM');

    dueDateInput.addEventListener('change', (event) => {
        let selectedDate = new Date(event.target.value);
        node.dueDate = selectedDate;
    });

    nodeMenuElement.appendChild(dueDateInput);


    const prioritySelect = document.createElement('select');
    prioritySelect.classList.add('nodeBtn', 'nodePriority');

    const priorities = [
        { value: 'No', label: 'No Priority' },
        { value: 'Low', label: 'Low Priority' },
        { value: 'Medium', label: 'Medium Priority' },
        { value: 'High', label: 'High Priority' },
    ];

    priorities.forEach((priority) => {
        const priorityOption = document.createElement('option');
        priorityOption.value = priority.value;
        priorityOption.textContent = priority.label;
        priorityOption.selected = priority.value === node.priorityLevel;
        prioritySelect.appendChild(priorityOption);
    });

    prioritySelect.addEventListener('change', (event) => {
        node.priorityLevel = event.target.value;
    });

    nodeMenuElement.appendChild(prioritySelect);


    const managerSelect = document.createElement('select');
    managerSelect.classList.add('nodeBtn', 'nodeManager');

    const managers = [
        { value: 'You', label: 'You are the project manager' },
        { value: 'Michael', label: 'Ada Lovelace is the project manager' },
        { value: 'Pam', label: 'Guido van Rossum is the project manager' },
        { value: 'Dwight', label: 'Linus Torvalds is the project manager' },
    ];

    managers.forEach((manager) => {
        const managerOption = document.createElement('option');
        managerOption.value = manager.value;
        managerOption.textContent = manager.label;
        managerOption.selected = manager.value === node.manager;
        managerSelect.appendChild(managerOption);
    });

    managerSelect.addEventListener('change', (event) => {
        node.manager = event.target.value;
    });

    nodeMenuElement.appendChild(managerSelect);

    return nodeElement;
}

export function collapseExpandDomNode(event) {
    const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const inputField = event.target;
    const currentDomNode = inputField.closest('.node');
    const currentUuid = currentDomNode.getAttribute('id')
    const objNode = findNodeByUuid(currentUuid)

    if (event.key === "ArrowUp" && event.shiftKey && ((isMacOS && event.metaKey) || (!isMacOS && event.ctrlKey))) {
        event.preventDefault
        hide(objNode)
        clearDomTree();
        renderTree(rootObj);
        moveFocusTo(currentUuid)
    }

    if (event.key === "ArrowDown" && event.shiftKey && ((isMacOS && event.metaKey) || (!isMacOS && event.ctrlKey))) {
        event.preventDefault
        show(objNode)
        clearDomTree();
        renderTree(rootObj);
        moveFocusTo(currentUuid)
    }

}

export function deleteDomNode(event) {
    const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const inputField = event.target;
    const currentTriangle = inputField.closest('.triangle');
    const currentDomNode = inputField.closest('.node');
    const currentUuid = currentDomNode.getAttribute('id')
    const objNode = findNodeByUuid(currentUuid)
    if (event.key === "Backspace" && ((isMacOS && event.metaKey) || (!isMacOS && event.ctrlKey))) {
        event.preventDefault()
        deleteNode(objNode)
        clearDomTree();
        renderTree(rootObj);
    }
    saveDataToLocalStorage()
}

export function toggleCompleteDomNode(event) {
    const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const inputField = event.target;
    const currentDomNode = inputField.closest('.node');
    const currentUuid = currentDomNode.getAttribute('id')
    const objNode = findNodeByUuid(currentUuid)

    if (event.key === "Enter" && ((isMacOS && event.metaKey) || (!isMacOS && event.ctrlKey))) {
        event.preventDefault
        toggleComplete(objNode)
        clearDomTree();
        renderTree(rootObj);
        moveFocusTo(currentUuid)
    }
}

export function moveDomNode(event) {
    const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const inputField = event.target
    const currentDomNodeID = inputField.closest('.node').id;
    const currentNode = findNodeByUuid(currentDomNodeID)
    const currentNodeIndex = findNodeIndex(currentNode)
    const siblingLength = currentNode.parent.children.length

    if (event.key === "ArrowDown" && ((isMacOS && event.metaKey) || (!isMacOS && event.ctrlKey)) && !event.shiftKey) {
        if (siblingLength > currentNodeIndex + 1) {
            insertNodeObject(currentNode, currentNode.parent, currentNodeIndex + 1)
            clearDomTree();
            renderTree(rootObj);
            moveFocusTo(currentDomNodeID)
        }

    }
    if (event.key === "ArrowUp" && ((isMacOS && event.metaKey) || (!isMacOS && event.ctrlKey)) && !event.shiftKey) {
        if (currentNodeIndex > 0) {
            insertNodeObject(currentNode, currentNode.parent, currentNodeIndex - 1)
            clearDomTree();
            renderTree(rootObj);
            moveFocusTo(currentDomNodeID)
        }

    }

}

export function moveFocusTo(uuid) {
    const formElement = document.querySelector(`form[data-uuid="${uuid}"]`)
    const inputField = formElement.querySelector('input.title')
    inputField.focus()
}

export function moveFocus(event) {
    const inputField = event.target;
    const currentDomNode = inputField.closest('.node');

    const previousDomNode = () => {
        let previousElementSibling = currentDomNode.previousElementSibling
        while (previousElementSibling && previousElementSibling.classList.contains('hidden')) {
            previousElementSibling = previousElementSibling.previousElementSibling;
        }
        return previousElementSibling
    }

    const nextDomNode = () => {
        let nextElementSibling = currentDomNode.nextElementSibling
        while (nextElementSibling && nextElementSibling.classList.contains('hidden')) {
            nextElementSibling = nextElementSibling.nextElementSibling;
        }
        return nextElementSibling
    }

    if (event.key === "ArrowDown" && !(event.metaKey || event.ctrlKey)) { // Down arrow key
        event.preventDefault();
        if (nextDomNode()) {
            const nextInputField = nextDomNode().querySelector('.title');
            nextInputField.focus();
        }
    }

    if (event.key === "ArrowUp" && !(event.metaKey || event.ctrlKey)) { // Up arrow key
        event.preventDefault();
        if (previousDomNode()) {
            const previousInputField = previousDomNode().querySelector('.title');
            previousInputField.focus()
        }
    }
}

export function indentDomNode(event) {
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

export function clearDomTree() {
    while (mainNode.firstChild) {
        mainNode.removeChild(mainNode.firstChild)
    }
}

export function findNodeByUuid(uuid, node = rootObj) {
    if (node.uuid === uuid) return node;

    for (const child of node.children) {
        const foundNode = findNodeByUuid(uuid, child);
        if (foundNode) {
            return foundNode;
        }
    }

    return null;
}

export function findLastDescendant(domNode) {
    let lastDescendant = domNode;
    const currentIndentLevel = parseInt(domNode.getAttribute('data-indentlvl'));

    for (let sibling = domNode.nextElementSibling; sibling; sibling = sibling.nextElementSibling) {
        const siblingIndentLevel = parseInt(sibling.getAttribute('data-indentlvl'));

        if (siblingIndentLevel <= currentIndentLevel) {
            break;
        }
        lastDescendant = sibling;
    }

    return lastDescendant;
}

export function appendDomNodeBeforeNextSibling(currentDomNode, newDomNode) {
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
        const lastDescendant = findLastDescendant(currentDomNode)
        lastDescendant.after(newDomNode)
    }
}

export function renderTree(parentObject) {
    let element = document.getElementById(parentObject.uuid)

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

