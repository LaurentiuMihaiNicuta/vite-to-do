//task.js

export function createTask(name,priority,status = false){
    return {
        getName: () => name,
        getPriority: () => priority,
        getStatus: () => status,
        changeStatus: () => { status=!status; } ,
        getDetails: () => ({
            text: name,
            priority: priority,
            status: status
        })
    }
}
