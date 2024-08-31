"use strict";
// Elements variable:
const formEl = document.querySelector(".container--form");
const inputEl = document.querySelector(".todo-input");
const todoListEl = document.querySelector(".container--todo-list");
const listCountEl = document.querySelector(".list-count");
const taskbarBtnsEl = document.querySelectorAll(".taskbar--btn");

// VARIABLE: ............................................................................................................
let todoItemId,
  dataList = [];
let message = "Please write something";

// FUNCTIONS: ............................................................................................................

const checkInput = (input) => (input.value.trim() === "" ? false : true);

const displayListCount = (data) => (listCountEl.textContent = data.length);

const addActivedClass = function (clsname) {
  if (!document.querySelector(`.${clsname}`)) return;

  taskbarBtnsEl.forEach((taskbarBtnEl) =>
    taskbarBtnEl.classList.remove("activited")
  );

  document.querySelector(`.${clsname}`).classList.add("activited");
};

const update = function (data) {
  todoListEl.textContent = "";

  data.forEach(function (todo) {
    const todoItemStr = `
    <li class="todo-item" id="${todo.id}">
      <div class="todo-item--title">
         <img class="title--checkbox ${
           todo.clicked ? "display--checkbox" : ""
         }" 
            src="img/icons8-checkmark-32.png"/>
         <p class="title--text ${todo.clicked ? "clickedItem" : ""}">${
      todo.title
    }</p>
      </div>
    
       <div class="todo-item--icon"></div>
    </li>
    `;
    todoListEl.insertAdjacentHTML("afterbegin", todoItemStr);
  });

  // Calculation todo item count
  displayListCount(data);
};

// GETTING STARTED with the SITE ..........................................................................................
inputEl.focus();

dataList = JSON.parse(localStorage.getItem("data"));
if (!dataList) dataList = [];
update(dataList);

addActivedClass("list-display--all");

// MAIN JS: ...............................................................................................................
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!checkInput(inputEl)) return alert(message);

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
  if (todoItemEl) {
    const clickedTodoItem = dataList.find(
      (todo) => todo.id === Number(todoItemEl.id)
    );
    clickedTodoItem.clicked = !clickedTodoItem.clicked;

    // Update todo list
    update(dataList);
    addActivedClass("list-display--all");

    //   Local storage
    localStorage.setItem("data", JSON.stringify(dataList));
  }
});

// TASKBAR BUTTONS
taskbarBtnsEl.forEach(function (taskbarBtnEl) {
  taskbarBtnEl.addEventListener("click", function (e) {
    let newList;
    let activeClass = e.target.classList.value.slice(17);

    if (e.target.closest(".list-display--all")) newList = dataList;
    if (e.target.closest(".list-display--active"))
      newList = dataList.filter((todo) => !todo.clicked);

    if (e.target.closest(".list-display--completed"))
      newList = dataList.filter((todo) => todo.clicked);

    if (e.target.closest(".list-delete--completed")) {
      newList = dataList.filter((todo) => !todo.clicked);
      dataList = newList;
      window.location.reload();
      localStorage.setItem("data", JSON.stringify(dataList));
    }

    if (e.target.closest(".list-delete--all")) {
      newList = dataList = [];
      localStorage.removeItem("data");
      window.location.reload();
    }

    addActivedClass(activeClass);
    update(newList);
  });
});
