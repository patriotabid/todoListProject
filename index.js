"use strict";

const formEl = document.querySelector(".container--form");
const inputEl = document.querySelector(".todo-input");

inputEl.focus();

formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(inputEl.value);
});
