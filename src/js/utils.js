//utils.js

export function createDOMElement(tag,className = ' ', textContent = ' ', attributes = {}){
    const element = document.createElement(tag);

    if(className){
        element.className = className;
    }
    if(textContent){
        element.textContent = textContent;
    }

    for(const key in attributes ){
        element.setAttribute(key,attributes[key]);
    }

    return element;

}


export function createCounter(){
   let counter = 0;

   return{
    getCounter: () => counter,
    resetCounter: () => counter = 0,
    addToCounter: () => counter++

   }
}


export function restAppend(parent,...theArgs){
    for(const arg of theArgs)
    parent.appendChild(arg)

}

export function arrayCounter(array) {
    let count = 0; 
    for (let i = 0; i < array.length; i++) {
        count++; 
    }
    return count; 
}