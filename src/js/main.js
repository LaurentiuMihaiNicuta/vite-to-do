//main.js

import '../css/style.css';
import { createSidebar } from './side-bar';
import { createDOMElement } from './utils';
import { createMainContent } from './content';
import { createTask } from './task';
import { createProject } from './project';




function createAppUI() {
    const appContainer = document.getElementById('app');
    appContainer.className = 'app-container';

    
    const {mainContent, mainContentBottom, mainContentTop} = createMainContent();
    const sideBar = createSidebar(mainContentBottom,mainContentTop);

    appContainer.appendChild(sideBar);
    appContainer.appendChild(mainContent);

    
}

createAppUI();