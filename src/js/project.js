//project.js

export function createProject(name,favorite){
    const taskList = [];

    return {
        getName : () => name,
        getTaskList: () => taskList,
        getFavorite:  () => favorite,
        addTask:(task) => {
            taskList.push(task);
        }
    }
}