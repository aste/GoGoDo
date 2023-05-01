// Dependencies
import { parse, stringify } from 'flatted';
import "./styles/styles.css";
import { setupNavBar } from "./navbar.js";
import {
    profileImage,
    settingsIcon,
    gogodoLogo,
    tabIcon,
    addBtn,
    infoBtn,
} from './assets.js';
import {
    rootObj,
    mainNode,
    mainNodeWrapper,
    newTaskBtn,
    createNodeObject,
    insertNodeObject,
    renderNode,
    moveFocusTo,
    renderTree,
    saveDataToLocalStorage,
    loadDataFromLocalStorage,
    updateRootObject,
} from "./node.js";

// DOM References
mainNode.id = rootObj.uuid
mainNode.classList.add('mainNode')
mainNodeWrapper.insertBefore(mainNode, newTaskBtn)

newTaskBtn.addEventListener('click', (event) => {
    const newNode = createNodeObject('')
    insertNodeObject(newNode)

    const newDomNode = renderNode(newNode)
    mainNode.appendChild(newDomNode)

    moveFocusTo(newNode.uuid)
    console.log(rootObj)
})

setupNavBar()

// localStorage.clear()

const storedRootObj = loadDataFromLocalStorage();

// Initial Test nodes
if (storedRootObj !== null) {
// if (false) {
    updateRootObject(storedRootObj)
} else {
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

    saveDataToLocalStorage()
}

renderTree(rootObj);

