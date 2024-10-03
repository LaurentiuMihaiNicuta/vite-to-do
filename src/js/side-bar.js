//side-bar.js


import { createDOMElement } from "./utils";
import { renderProjectTasks } from "./content";
import { createCounter } from "./utils";
import { restAppend } from "./utils";
import { createProject } from "./project";
import { createMainContent, renderTopContent } from "./content";
import { arrayCounter } from "./utils";
import { createTask } from "./task";


export function createSidebar(mainContentBottom, mainContentTop) {

    const projects = loadProjectsFromLocalStorage();  
    const counter = createCounter();
    const sideBar = createDOMElement('div', 'side-bar', '');
    const sideBarTop = createDOMElement('div', 'side-bar-top', '');
    const sideBarBottom = createDOMElement('div', 'side-bar-bottom', '');

    restAppend(sideBar, sideBarTop, sideBarBottom);

    const sideBarTitle = createDOMElement('h1', '', 'Projects:');
    const addNewProjectButton = createDOMElement('button', '', 'New Project');

    restAppend(sideBarTop, sideBarTitle, addNewProjectButton);

    addNewProjectButton.addEventListener('click', function() {
        if (counter.getCounter() === 0) {
            counter.addToCounter();

            const formContainer = createDOMElement('div', '', '');
            const form = createDOMElement('form', '', '');

            const nameField = createDOMElement('input', '', '', { type: 'text', name: 'nameField' });
            const submitButton = createDOMElement('button', '', 'Add', { type: 'submit' });
            const favoriteField = createDOMElement('input', '', '', { type: 'checkbox', name: 'favoriteField' });

            restAppend(form, nameField, favoriteField, submitButton);
            formContainer.appendChild(form);
            sideBarBottom.insertBefore(formContainer, sideBarBottom.firstChild);

            form.addEventListener('submit', function(event) {
                handleProjectFormSubmit(event, nameField, favoriteField, counter, projects, sideBarBottom, mainContentBottom, mainContentTop);
            });
        }
    });

    // Renderizează proiectele din localStorage
    renderProjects(projects, sideBarBottom, mainContentBottom, mainContentTop);

    return sideBar;
}

function handleProjectFormSubmit(event, nameField, favoriteField, counter, projects, sideBarBottom, mainContentBottom, mainContentTop) {
    event.preventDefault();

    const projectName = nameField.value;
    const projectFavorite = favoriteField.checked;

    if (projectName) {
        const newProject = createProject(projectName, projectFavorite);
        projects.push(newProject);

        // Salvăm proiectele în localStorage
        saveProjectsToLocalStorage(projects);

        renderProjects(projects, sideBarBottom, mainContentBottom, mainContentTop);
    }

    counter.resetCounter();
}

function renderProjects(projects, sideBarBottom, mainContentBottom, mainContentTop) {
    sideBarBottom.innerHTML = '';

    projects.forEach((project, index) => {
        const projectContainer = createDOMElement('div', '', '');
        const projectTitle = createDOMElement('h1', '', project.getName());
        const deleteButton = createDOMElement('button', '', 'X');

        restAppend(projectContainer, projectTitle, deleteButton);
        sideBarBottom.appendChild(projectContainer);

        projectTitle.addEventListener('click', function () {
            renderProjectTasks(project, mainContentBottom, projects); // Pasăm și projects
            renderTopContent(project, mainContentTop, mainContentBottom, projects); // Pasăm și projects
        });

        deleteButton.addEventListener('click', function () {
            mainContentTop.innerHTML = '';
            mainContentBottom.innerHTML = '';
            projects.splice(index, 1);

            // Salvăm proiectele actualizate în localStorage
            saveProjectsToLocalStorage(projects);

            renderProjects(projects, sideBarBottom, mainContentBottom, mainContentTop);
        });
    });
}

export function saveProjectsToLocalStorage(projects) {
    const projectsJSON = JSON.stringify(projects.map(project => ({
        name: project.getName(),
        favorite: project.getFavorite(),
        tasks: project.getTaskList().map(task => ({
            name: task.getName(),
            priority: task.getPriority(),
            status: task.getStatus()
        }))
    })));
    localStorage.setItem('projects', projectsJSON);
}

export function loadProjectsFromLocalStorage() {
    const projectsJSON = localStorage.getItem('projects');
    if (projectsJSON) {
        const parsedProjects = JSON.parse(projectsJSON);
        return parsedProjects.map(proj => {
            const newProject = createProject(proj.name, proj.favorite);
            proj.tasks.forEach(task => {
                newProject.addTask(createTask(task.name, task.priority, task.status));  // Restaurăm taskurile în proiect
            });
            return newProject;
        });
    }
    return [];
}
