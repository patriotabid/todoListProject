"use strict";
// Elements variable:
const containerEl = document.querySelector(".container");
const formEl = document.querySelector(".container--form");
const inputEl = document.querySelector(".todo-input");
const todoListEl = document.querySelector(".container--todo-list");
const listCountEl = document.querySelector(".list-count");
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

const displayListCount = (data) => (listCountEl.textContent = data.length);

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

const update = function (data, activeClass) {
  todoListEl.textContent = "";

  data.forEach(function (todo) {
    const todoItemStr = `
    <li class="todo-item" id="${todo.id}">
      <div class="todo-item--title">
         <img class="title--checkbox ${todo.clicked && "display--checkbox"}" 
            src="img/icons8-checkmark-32.png"/>
         <p class="title--text ${todo.clicked && "clickedItem"}">${
      todo.title
    }</p>
      </div>
    
       <div class="todo-item--delete ${todo.clicked && "completedItem"}">X</div>
    </li>
    `;
    todoListEl.insertAdjacentHTML("afterbegin", todoItemStr);
  });

  // Calculation todo item count
  displayListCount(data);

  // Define actived taskbar display button
  addActivedClass(activeClass || "list-display--all");
};

// GETTING STARTED with the SITE ..........................................................................................
inputEl.focus();

dataList = JSON.parse(localStorage.getItem("data"));
if (!dataList) dataList = [];
update(dataList);

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

  //   Local storage
  localStorage.setItem("data", JSON.stringify(dataList));

  //   Init function
  inputEl.value = "";
});

// TODO LIST COMPLETE ITEM
todoListEl.addEventListener("click", function (e) {
  const todoItemEl = e.target.closest(".todo-item");

  // Find clicked todo item
  if (e.target.closest(".todo-item--title")) {
    const clickedTodoItem = dataList.find(
      (todo) => todo.id === Number(todoItemEl.id)
    );
    clickedTodoItem.clicked = !clickedTodoItem.clicked;
  }

  // Find removed todo item
  if (e.target.closest(".todo-item--delete")) {
    // Display alert window
    displayAlertWindow(true);
    // Create new array for display todo list
    alertMessageTextEl.textContent = message.deleteTodoItem;

    newDataListAftedDeleteTodo = dataList.filter(
      (todo) => todo.id !== Number(todoItemEl.id)
    );

    return;
  }

  // Update todo list
  update(dataList);
  localStorage.setItem("data", JSON.stringify(dataList));
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
    update(newList, activeClass);
  });
});

// WINDOW ALERT
windowAlert.addEventListener("click", function (e) {
  // Hidden alert window
  if (e.target.closest(".btn--cancel")) displayAlertWindow(false);

  if (e.target.closest(".btn--ok")) {
    displayAlertWindow(false);

    // Update todo list after delete todo item
    update(newDataListAftedDeleteTodo);
    localStorage.setItem("data", JSON.stringify(newDataListAftedDeleteTodo));
  }
});
