//content.js
import { saveProjectsToLocalStorage } from './side-bar';  
import { createDOMElement } from "./utils";
import { restAppend } from "./utils";
import { createTask } from "./task";
import { createCounter } from "./utils";

export function createMainContent() {
    const mainContent = createDOMElement('div', 'main-content', '');
    const mainContentTop = createDOMElement('div', 'main-content-top', '');
    const mainContentBottom = createDOMElement('div', 'main-content-bottom', '');

    restAppend(mainContent, mainContentTop, mainContentBottom);

    return {
        mainContent,
        mainContentBottom,
        mainContentTop
    };
}

export function renderProjectTasks(project, container, projects, isDescending = false) {
    container.innerHTML = '';  // Golește mainContent pentru a afișa noile taskuri

    let taskList = project.getTaskList();  // Obține lista de taskuri

    // Sortăm taskurile în funcție de prioritate
    taskList = taskList.sort((a, b) => {
        const priorities = { 'low': 1, 'medium': 2, 'high': 3 };
        if (isDescending) {
            return priorities[b.getPriority()] - priorities[a.getPriority()];  // Sortare descrescătoare
        } else {
            return priorities[a.getPriority()] - priorities[b.getPriority()];  // Sortare crescătoare
        }
    });

    taskList.forEach((task, index) => {
        // Creează un container pentru task și butonul de ștergere
        const taskContainer = createDOMElement('div', 'task-container', '');  // 'task-container' pentru stilizare

        const taskElement = createDOMElement('p', '', task.getName());  // Creează un element <p> pentru task name
        const deleteButton = createDOMElement('button', '', 'X');  // Creează butonul de ștergere

        // Colorăm taskul în funcție de prioritate
        const priority = task.getPriority();
        if (priority === 'low') {
            taskContainer.style.border = '2px solid green';
        } else if (priority === 'medium') {
            taskContainer.style.border = '2px solid orange';
        } else if (priority === 'high') {
            taskContainer.style.border = '2px solid red';
        }

        // Adaugă taskElement și deleteButton în taskContainer
        taskContainer.appendChild(taskElement);
        taskContainer.appendChild(deleteButton);

        // Adaugă taskContainer în containerul principal
        container.appendChild(taskContainer);

        // Event pentru ștergerea taskului
        deleteButton.addEventListener('click', function () {
            taskList.splice(index, 1);  // Șterge task-ul din lista de taskuri
            renderProjectTasks(project, container, projects, isDescending);  // Re-render după ștergere

            // Salvăm proiectele actualizate în localStorage
            saveProjectsToLocalStorage(projects);  // Actualizează toate proiectele, inclusiv cel curent
        });
    });
}

export function renderTopContent(project, mainContentTop, mainContentBottom, projects) {
    mainContentTop.innerHTML = '';

    const projectName = project.getName();
    const counter = createCounter();
    let isDescending = false;  // Variabilă pentru a alterna sortarea

    const projectNameSection = createDOMElement('div', '', projectName);
    const projectButtonSection = createDOMElement('div', '', '');
    const filterButton = createDOMElement('button', '', 'Filter Tasks');
    const addNewTaskButton = createDOMElement('button', '', 'Add new Task');

    restAppend(mainContentTop, projectNameSection, projectButtonSection);
    restAppend(projectButtonSection, filterButton, addNewTaskButton);

    // Funcționalitatea de sortare
    filterButton.addEventListener('click', function () {
        isDescending = !isDescending;  // Alternăm ordinea
        renderProjectTasks(project, mainContentBottom, projects, isDescending);  // Re-render taskurile sortate
    });

    addNewTaskButton.addEventListener("click", function () {
        if (counter.getCounter() === 0) {
            counter.addToCounter();
            const formContainer = createDOMElement('div', '', '');
            const form = createDOMElement('form', '', '');

            const nameField = createDOMElement('input', '', '', { placeholder: 'Task Name' });
            const priorityField = createDOMElement('select', '', '', { name: 'priorityField' });

            const option1 = createDOMElement('option', '', 'Low', { value: 'low' });
            const option2 = createDOMElement('option', '', 'Medium', { value: 'medium' });
            const option3 = createDOMElement('option', '', 'High', { value: 'high' });

            restAppend(priorityField, option1, option2, option3);

            const submitButton = createDOMElement('button', '', 'Add Task', { type: 'submit' });

            restAppend(form, nameField, priorityField, submitButton);
            formContainer.appendChild(form);
            mainContentBottom.insertBefore(formContainer, mainContentBottom.firstChild);

            form.addEventListener('submit', function (event) {
                handleContentForm(event, nameField, priorityField, project, mainContentBottom, projects); // Pasăm și projects
                counter.resetCounter();
            });
        }
    });
}

function handleContentForm(event, nameField, priorityField, project, mainContentBottom, projects) { // Adăugăm 'projects' ca parametru
    event.preventDefault();

    const taskName = nameField.value;
    const taskPriority = priorityField.value;

    if (!taskName) {
        alert('Task name is required!');
        return;
    }

    const newTask = createTask(taskName, taskPriority, true);
    project.addTask(newTask);

    // Re-render the tasks after adding the new task
    renderProjectTasks(project, mainContentBottom, projects);  // Pasăm și projects

    // Salvăm proiectele actualizate în localStorage
    saveProjectsToLocalStorage(projects);  // Actualizează toate proiectele, inclusiv cel curent

    // Optional: Clear the form fields after submit
    nameField.value = '';
    priorityField.value = 'low';  // Set the default priority value after submit
}