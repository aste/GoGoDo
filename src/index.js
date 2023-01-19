import { v4 as uuid } from 'uuid'
import "./styles/styles.css";
import profileImage from './assets/anonProfileIconGrey.svg'
import settingsIcon from './assets/settingsGrey.svg'
import gogodoLogo from './assets/gogodoLogoCyan.svg'
const dateFns = require('date-fns')

function createTask(title) {
    return {
        uuid: uuid(),
        title: title,
        description: undefined,
        priority: undefined, // used to sort the task by importance
        startDate: dateFns.addHours(dateFns.startOfDay(new Date()), 8), // set startDate 8am today
        dueDate: dateFns.addDays(dateFns.addHours(dateFns.startOfDay(new Date()), 18), 7), // 6pm in a week
        Progress: 0, // 0 to 100%, add up all the children combined progress * their weight
        targetProgress: undefined, // check if the progress is in accordance with the date and the

        // should be replaced with keys later
        createParent: undefined, // btn create a new parent for the task
        createSibling: undefined, // btn create a new sibling for the task
        createChild: undefined, // btn create a new child for the task

        // For later implementation
        resources: 'optional path for project resources', // path for resources relevant to the task
        scope: undefined, // rate the tasks by estimated amount of work 
        collapseUnfold: undefined, // collapse all children of the task
        dependencies: undefined, // parents are dependent on all children, add other manually
        owner: undefined, // define the user who owns this tasks and the responsibilities
        readPermission: undefined, // define users who have permission to read this task
        writePermission: undefined, // define users who have permission to edit or add items
        deletePermission: undefined, // define users who have permission to delete to this task
        readAccess: undefined, // expand all children of the task
    }
}

function newUser(name) {
    return {
        officeHoursStart: undefined,
        officeHoursEnd: undefined,
        officeDays: undefined,
        workingOn: undefined,
        flowStatus: undefined,
    }
}

console.log(createTask("firstTodo"))
// console.log(createTask("secondTodo"))