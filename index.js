"use strict";

// Elements variable:
const formEl = document.querySelector(".container--form");
const inputEl = document.querySelector(".todo-input");
const todoListEl = document.querySelector(".container--todo-list");
const listCountEl = document.querySelector(".list-count");
const containerTaskbarEl = document.querySelector(".container--taskbar");

// VARIABLE: ............................................................................................................
let dataList = [];
let message = "Please write something";

// FUNCTIONS: ............................................................................................................

const checkInput = (input) => (input.value.trim() === "" ? false : true);

const displayListCount = (data) => (listCountEl.textContent = data.length);

const update = function (data) {
  todoListEl.textContent = "";

  data.forEach(function (todo, i) {
    const todoItemStr = `
    <li class="todo-item">
    <div class="todo-item--title">
    <span class="title--check-icon"><i>icon</i></span>
    <p class="title--text ${todo.clicked ? "clickedItem" : ""}" id="${i}">
    ${todo.title}</p>
    </div>
    
    <div class="todo-item--icon"></div>
    </li>
    `;
    todoListEl.insertAdjacentHTML("afterbegin", todoItemStr);
  });

  // Calculation todo item count
  displayListCount(data);
};

const addActivedClass = function (clsname) {
  document.querySelector(".list-display--all").classList.remove("activited");
  document.querySelector(".list-display--active").classList.remove("activited");
  document
    .querySelector(".list-display--completed")
    .classList.remove("activited");

  document.querySelector(`.${clsname}`).classList.add("activited");
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

  //   Push data new todo item
  const newTodoItem = { title: inputEl.value, clicked: false };
  dataList.push(newTodoItem);

  //   Update
  update(dataList);

  //   Local storage
  localStorage.setItem("data", JSON.stringify(dataList));

  //   Init function
  inputEl.value = "";
});

// TASKBAR BUTTONS
containerTaskbarEl.addEventListener("click", function (e) {
  let newList;
  if (e.target.classList.value.includes("list-display--all"))
    newList = dataList;

  if (e.target.classList.value.includes("list-display--active"))
    newList = dataList.filter((todo) => !todo.clicked);

  if (e.target.classList.value.includes("list-display--completed"))
    newList = dataList.filter((todo) => todo.clicked);

  if (e.target.classList.value.includes("list-delete")) {
    newList = dataList = [];
    localStorage.removeItem("data");
    window.location.reload();
  } else {
    return;
  }

  addActivedClass(e.target.classList.value.slice(4));
  update(newList);
});

todoListEl.addEventListener("click", function (e) {
  if (e.target.closest(".todo-item")) {
    const todoItemIndex = Number(e.target.id);
    dataList[todoItemIndex].clicked = !dataList[todoItemIndex].clicked;

    update(dataList);

    //   Local storage
    localStorage.setItem("data", JSON.stringify(dataList));
  }
});

// Things to do:
/*
   1. create taskbar for todo list data
   2. add remove function for remove items from data and local storage
   3. find icon for check todo item
   4. fix input border
   5. add dark mode and send to local storage active mode
   6. find header picture for container

 */

// console.log("btn list-display--all activited".slice(4, -10));
// console.log("btn list-display--completed activited".slice(4, -10));
