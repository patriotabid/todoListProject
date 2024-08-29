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
    <li class="todo-item" id="${i}">
      <div class="todo-item--title">
         <img class="title--checkbox ${
           todo.clicked ? "display--checkbox" : ""
         }" 
            src="img/icons8-checkmark-32.png"/>
         <p class="title--text ${todo.clicked ? "clickedItem" : ""}">
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
  if (!document.querySelector(`.${clsname}`)) return;

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

// TODO LIST COMPLETE ITEM
todoListEl.addEventListener("click", function (e) {
  const todoItem = e.target.closest(".todo-item");

  if (todoItem) {
    const index = Number(todoItem.id);
    dataList[index].clicked = !dataList[index].clicked;

    update(dataList);
    //   Local storage
    localStorage.setItem("data", JSON.stringify(dataList));
  }
});

// TASKBAR BUTTONS
containerTaskbarEl.addEventListener("click", function (e) {
  let newList = dataList;

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

  addActivedClass(e.target.classList.value.slice(4));
  update(newList);
});
