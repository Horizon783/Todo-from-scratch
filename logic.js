const form = document.querySelector('form');
const taskBar = document.querySelector('#add-task');
const todoList = document.querySelector("#todo-list");
const key = "todo_key"; // key for local storage 
let todo_data = (localStorage.getItem(key))? JSON.parse(localStorage.getItem(key)):[]; // contains tasks/todos as objects

const modal = document.querySelector('#modal')
const editBar = document.querySelector('#modal input')
// console.log(taskBar)
// console.log(taskBar)

//  update dom if array has data
const createTodo = function(id, taskInfo, completed=false){
    // create a todo
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type","checkbox");
    checkBox.setAttribute("class","checkbox");

    const task = document.createElement("span");
    task.innerText = taskInfo;
    task.setAttribute('class', 'taskInfo')

    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.setAttribute('class', 'editTask')

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = 'Delete';
    deleteBtn.setAttribute('class','deleteBtn')

    const todo = document.createElement("li");
    todo.appendChild(checkBox);
    todo.appendChild(task);
    todo.appendChild(editBtn);
    todo.appendChild(deleteBtn);
    todo.setAttribute('id',`${id}`);

    if(completed){
        checkBox.setAttribute('checked','true')
        todo.classList.add('finished')
    }

    return todo;
}

const renderTodo = function(){
    if(todo_data.length === 0){
        const message = document.createElement("li");
        message.innerText = "No Tasks";
        todoList.appendChild(message);
        return;
    }

    todo_data.forEach((task) => {
        const todo = createTodo(task.id, task.text, task.completed);
        todoList.appendChild(todo);
    });
}

if (todo_data.length != 0){
    // render/ diplay all tasks in todoList
    todoList.removeChild(todoList.firstElementChild)
    todo_data.forEach((task) => {
        const todo = createTodo(task.id, task.text, task.completed);
        todoList.appendChild(todo);
    });
}

// first problem enter task from task bar to todo list

const validateInput = function(inputString){
    let value = inputString.trim();
    if(value === '') return false;
    else return true;
}

const deleteAllTask = function(){
    todo_data = [];
    saveArray();
    // render DOM
    todoList.innerHTML="<li>No task</li>";
}

const addArray = function(task_data){
    let todo_obj = {
        id: Date.now(),
        text: task_data,
        completed: false
    }
    todo_data.push(todo_obj);
    return todo_obj;
}

const saveArray = function(){
    const arrayDataString = JSON.stringify(todo_data);
    localStorage.setItem(key, arrayDataString);
}


const addTask = function(task_string){
    // console.log('The task is ',taskBar.value);

    if(todo_data.length === 0){
        todoList.removeChild(todoList.firstElementChild)
        // noTask = false;
    }
    const taskObj = addArray(task_string);
    saveArray();

    // update DOM from source of truth which is array/todo_data
    // below we render the task in UI
    const todo = createTodo(taskObj.id, taskObj.text);
    todoList.appendChild(todo);
}

document.querySelector('#removeAll').addEventListener('click', deleteAllTask);

form.addEventListener('submit', function(e){
    e.preventDefault()
    //console.log(e.submitter)
    // console.log(e.currentTarget)
    if(!validateInput(taskBar.value)){
        taskBar.value = "";
        return;
    }   
    // let addTask add task to todo list
    addTask(taskBar.value);
    taskBar.value ="";
},false);

// second problem delete tasks from todo list

const removeTask = function(target){
    // console.log("running removeTask")
    // console.log(target.closest("li"));
    const listItem = target.closest('li');
    // delete from array
    todo_data = todo_data.filter((task) => task.id !== parseInt(listItem.id));
    saveArray();

    // update DOM
    todoList.removeChild(listItem);
    // render DOM

    if(todo_data.length === 0){
        const message = document.createElement("li");
        message.innerText = "No Tasks";
        todoList.appendChild(message);
    }
}

const getTaskById = function(id){
    return todo_data.find((task)=>(task.id == id));
}

todoList.addEventListener('click', function(e){
    // console.log((e.target.checked));
    // if click on delete button
    if(e.target.classList.contains('deleteBtn')){
        removeTask(e.target);
    }
    else if (e.target.classList.contains('checkbox')){
        // here i am not checking wether input is checked true or false
        // the reason is bcoz of toggle() used on classList if the class is not prresents it adds to the list and vice-versa
        const list = e.target.closest('li');
        // list.classList.toggle('finished') commenting as we its CSS dependent and we want the truth to be checkBox
        if (e.target.checked) {
            list.classList.add('finished');
            const task = getTaskById(parseInt(list.id));
            task.completed = e.target.checked;
            
        } else {
            list.classList.remove('finished');
            const task = getTaskById(parseInt(list.id));
            task.completed = e.target.checked;
        }
        saveArray()
    }
    else if (e.target.classList.contains('editTask')){
        editingTask = parseInt(e.target.closest('li').id);
        openModal()
        // closeModal()
        // saveArray();
    }
})

// editing a task
let editingTask = null;


const openModal = function(){
    console.log(editingTask)
    modal.classList.add('open-popup')
    const task = getTaskById(editingTask);

    if (!task) {
        alert("Task no longer exists");
        return;
    }

    editBar.value = task.text;
   

    // editBar.value = todo_data.forEach((task) =>{
    //     if(task.id === editingTask) return task.text;
    // })
}

const closeModal = function() {
    editBar.value = '';
    modal.classList.remove('open-popup');
    editingTask = null;
}

const saveEdit = function() {
    let newTask = editBar.value
    if(!validateInput(newTask)) return;
    if(!getTaskById(editingTask)){
        alert("Task is not Present");
        closeModal();
        return;
    }
    const currentTask = getTaskById(editingTask)
    console.log(currentTask)
    currentTask.text = newTask;

    saveArray();
    // render changes in DOM
    const list = document.getElementById(`${editingTask}`);
    const span = list.getElementsByClassName(`taskInfo`)[0];
    console.log(span)
    span.innerText = newTask;   
    closeModal();
}

const cancelEdit = function(){
    closeModal();
}

document.querySelector('#saveBtn').addEventListener('click', saveEdit)
document.querySelector('#cancelBtn').addEventListener('click', cancelEdit)


