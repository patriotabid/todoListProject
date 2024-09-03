"use strict";
// Elements variable:
const containerEl = document.querySelector(".container");
const formEl = document.querySelector(".container--form");
const inputEl = document.querySelector(".todo-input");
const todoListEl = document.querySelector(".container--todo-list");
const TaskbarListCountEl = document.querySelector(".taskbar--list-count");
const taskbarBtnElements = document.querySelectorAll(".taskbar--btn");
const windowAlert = document.querySelector(".window--alert");
const alertBtnsEl = document.querySelector(".alert__buttons");
const alertMessageTextEl = document.querySelector(".alert__message--text");

// VARIABLE: ............................................................................................................
let todoItemId, newDataListAftedDeleteTodo, dataList;
let message = {
  emptyInput: "Please write something",
  deleteTodoItem: "Do you sure want to delete this task?",
  deleteAllTodoList: "Do you sure want to delete all tasks?",
  deleteCompletedTodoList: "Do you sure want to delete completed tasks?",
};

// FUNCTIONS: ............................................................................................................

const checkInput = (input) => (input.value.trim() === "" ? false : true);

const displayListCount = (data) =>
  (TaskbarListCountEl.textContent = `${data.length} ${
    data.length <= 1 ? "item left" : "items left"
  }`);

const addActivedClass = function (clsname) {
  if (!document.querySelector(`.${clsname}`)) return;

  taskbarBtnElements.forEach((taskbarBtnEl) =>
    taskbarBtnEl.classList.remove("activited")
  );

  document.querySelector(`.${clsname}`).classList.add("activited");
};

// Display alert window
const displayAlertWindow = function (display) {
  if (display) {
    windowAlert.classList.remove("hidden");
    containerEl.classList.add("background");
    return;
  }
  windowAlert.classList.add("hidden");
  containerEl.classList.remove("background");
};

// Add edit class Elements
const addEditingClass = (el, add) =>
  add
    ? el.classList.add("todo-item--editing")
    : el.classList.remove("todo-item--editing");

const update = function (data, activeClass, noSetItem) {
  todoListEl.textContent = "";

  data.forEach(function (todo) {
    const todoItemStr = `
    <li class="todo-item" id="${todo.id}">
      <div class="todo-item--title">
         <img class="title--checkbox ${todo.clicked && "display--checkbox"}" 
            src="img/icons8-checkmark-32.png"/>
         <input id="todo--input${todo.id}" class="title--text task--input ${
      todo.clicked && "clickedItem"
    }" value="${todo.title}" readonly>
      </div>
      
      <div class="todo-item__buttons ${todo.clicked && "completedItem"}">
        <button class="btn todo-item__buttons--edit" 
          id="todo--edit${todo.id}">edit</button> 
        <div class="border-between--btns"></div>
        <button class="btn todo-item__buttons--delete">X</button> 
      </div>
    </li>
    `;
    todoListEl.insertAdjacentHTML("afterbegin", todoItemStr);
  });

  // Calculation todo item count
  displayListCount(data);

  // Define actived taskbar display button
  addActivedClass(activeClass || "list-display--all");

  // Set data local Storage
  if (!noSetItem) localStorage.setItem("data", JSON.stringify(data));

  //   Init function
  inputEl.value = "";
  inputEl.focus();
};

// GETTING STARTED with the SITE ..........................................................................................

const gettingStartedCallFunc = function () {
  dataList = JSON.parse(localStorage.getItem("data"));
  if (!dataList) dataList = [];

  update(dataList);
};
gettingStartedCallFunc();

// MAIN JS: ...............................................................................................................
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!checkInput(inputEl)) return alert(message.emptyInput);

  // Created new id
  todoItemId = dataList.length ? dataList.length : 0;
  todoItemId += 1;

  //   Push data new todo item
  const newTodoItem = { title: inputEl.value, clicked: false, id: todoItemId };
  dataList.push(newTodoItem);

  //   Update
  update(dataList);
});

// TODO LIST
todoListEl.addEventListener("click", function (e) {
  const todoItemEl = e.target.closest(".todo-item");

  // Find clicked todo item
  if (e.target.closest(".todo-item--title")) {
    // If item is editing don't complete it
    if (todoItemEl.classList.contains("todo-item--editing")) return;

    const clickedTodoItem = dataList.find(
      (todo) => todo.id === Number(todoItemEl.id)
    );
    clickedTodoItem.clicked = !clickedTodoItem.clicked;

    // Update todo list
    update(dataList);
  }

  // Find to delete todo item
  if (e.target.closest(".todo-item__buttons--delete")) {
    // Display alert window
    displayAlertWindow(true);
    // Create new array for display todo list
    alertMessageTextEl.textContent = message.deleteTodoItem;

    newDataListAftedDeleteTodo = dataList.filter(
      (todo) => todo.id !== Number(todoItemEl.id)
    );

    // Update todo list
    update(dataList);
  }

  // Find to edit todo item
  if (e.target.closest(".todo-item__buttons--edit")) {
    const clickedTodoItem = dataList.find(
      (todo) => todo.id === Number(todoItemEl.id)
    );

    // Find to edit todo item
    const clickedInputEl = document.querySelector(
      `#todo--input${clickedTodoItem.id}`
    );
    const editBtn = document.querySelector(`#todo--edit${clickedTodoItem.id}`);

    // Delete to edit readonly attr
    if (clickedInputEl.attributes.readonly) {
      addEditingClass(todoItemEl, true);
      addEditingClass(clickedInputEl, true);

      clickedInputEl.removeAttribute("readonly");
      editBtn.textContent = "save";
      clickedInputEl.focus();

      return;
    }

    // Add to save readonly attr
    if (!clickedInputEl.attributes.readonly) {
      clickedTodoItem.title = clickedInputEl.value;

      addEditingClass(todoItemEl, false);
      addEditingClass(clickedInputEl, false);

      clickedInputEl.setAttribute("readonly", true);
      editBtn.textContent = "edit";

      // Update todo list
      update(dataList);
      return;
    }
  }
});

// TASKBAR BUTTONS
taskbarBtnElements.forEach(function (taskbarBtnEl) {
  taskbarBtnEl.addEventListener("click", function (e) {
    let newList;
    let activeClass = e.target.classList.value.slice(17);

    if (e.target.closest(".list-display--all")) newList = dataList;
    if (e.target.closest(".list-display--active"))
      newList = dataList.filter((todo) => !todo.clicked);

    if (e.target.closest(".list-display--completed"))
      newList = dataList.filter((todo) => todo.clicked);

    if (e.target.closest(".list-delete--completed")) {
      // Display alert window
      displayAlertWindow(true);
      alertMessageTextEl.textContent = message.deleteCompletedTodoList;

      // Create new data list after delete completed todo items
      newDataListAftedDeleteTodo = dataList.filter((todo) => !todo.clicked);
      return;
    }

    if (e.target.closest(".list-delete--all")) {
      // Display alert window
      displayAlertWindow(true);
      alertMessageTextEl.textContent = message.deleteAllTodoList;

      // Create new data list after delete all todo list
      newDataListAftedDeleteTodo = [];
      return;
    }

    // Update
    update(newList, activeClass, true);
  });
});

// WINDOW ALERT
windowAlert.addEventListener("click", function (e) {
  // Hidden alert window
  if (e.target.closest(".btn--cancel")) displayAlertWindow(false);

  if (e.target.closest(".btn--ok")) {
    displayAlertWindow(false);

    // Update todo list after delete todo item
    dataList = newDataListAftedDeleteTodo;
    update(newDataListAftedDeleteTodo);
  }
});
