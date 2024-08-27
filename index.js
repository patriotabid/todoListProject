"use strict";

// Elements variable:
const formEl = document.querySelector(".container--form");
const inputEl = document.querySelector(".todo-input");
const todoListEl = document.querySelector(".todo-list");

// VARIABLE:
let dataList = [];
let message = "Please write something";

// FUNCTIONS:
inputEl.focus();

const checkInput = (input) => (input.value.trim() === "" ? false : true);

const update = function (data, el) {
  el.textContent = "";

  data.forEach(function (todo) {
    const todoItemStr = `
  <li class="todo-item">
    <div class="todo-item--title">
      <span class="title--check-icon"><i>icon</i> </span>
      <p class="title--text">${todo.title}</p>
    </div>

    <div class="todo-item--icon"></div>
    </li>
  `;
    el.insertAdjacentHTML("afterbegin", todoItemStr);
  });
};

// Update DataList:
dataList = JSON.parse(localStorage.getItem("data"));
if (!dataList) dataList = [];
update(dataList, todoListEl);

// MAIN JS:
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!checkInput(inputEl)) return alert(message);

  //   Push data new todo item
  const newTodoItem = { title: inputEl.value };
  dataList.push(newTodoItem);

  //   Update
  update(dataList, todoListEl);

  //   Local storage
  localStorage.setItem("data", JSON.stringify(dataList));

  //   Init function
  inputEl.value = "";
});
``;
