import * as htmlEl from "./html.js";

// FUNCTIONS: ............................................................................................................

export const checkInput = (input) => (input.value.trim() === "" ? false : true);

export const displayListCount = (data) =>
  (htmlEl.TaskbarListCountEl.textContent = `${data.length} ${
    data.length <= 1 ? "item left" : "items left"
  }`);

export const addActivedClass = function (clsname) {
  if (!document.querySelector(`.${clsname}`)) return;

  htmlEl.taskbarBtnElements.forEach((taskbarBtn) =>
    taskbarBtn.classList.remove("activited")
  );

  document.querySelector(`.${clsname}`).classList.add("activited");
};

// Display alert window
export const displayAlertWindow = function (display) {
  if (display) {
    htmlEl.windowAlert.classList.remove("hidden");
    htmlEl.containerEl.classList.add("background");
    return;
  }
  htmlEl.windowAlert.classList.add("hidden");
  htmlEl.containerEl.classList.remove("background");
};

// Add edit class Elements
export const addEditingClass = (el, add) =>
  add
    ? el.classList.add("todo-item--editing")
    : el.classList.remove("todo-item--editing");

// Get todo item id
export const getTodoItemId = function () {
  let todoItemId = Number(JSON.parse(localStorage.getItem("todoItemId")));

  if (!todoItemId) todoItemId = 1;
  else if (todoItemId) todoItemId += 1;

  localStorage.setItem("todoItemId", JSON.stringify(todoItemId));
  return todoItemId;
};

//   Init function
export const initInput = () => {
  htmlEl.inputEl.value = "";
  htmlEl.inputEl.focus();
};

// Show searched todo item
export const displaySearchedTodo = function (findedTodoItem) {
  const findedTodoEl = document.querySelector(`#todo-item${findedTodoItem.id}`);

  // display item
  findedTodoEl.classList.add("green-border");
  // cancel item
  setTimeout(() => {
    findedTodoEl.classList.remove("green-border");
  }, 1000);

  // scroll searched todo item
  findedTodoEl.scrollIntoView({
    behavior: "smooth",
  });
};

// Add search field todo items
export const addSearchedField = function (findedTodoItems) {
  findedTodoItems.forEach((findedTodoItem) => {
    const findedTodoEl = document.querySelector(
      `#todo-item${findedTodoItem.id}`
    );

    const str = `
    <li class="searched__todo-item">${findedTodoItem.title}</li>
    `;

    htmlEl.searchedTodoListEl.insertAdjacentHTML("beforeend", str);
    htmlEl.searchedField.classList.remove("hidden");
  });
};

// UPDATE Function
const update = function (data, activeClass, noSetItem) {
  htmlEl.todoListEl.textContent = "";

  data.forEach(function (todo) {
    const todoItemStr = `
    <li class="todo-item" id="todo-item${todo.id}">
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
    htmlEl.todoListEl.insertAdjacentHTML("afterbegin", todoItemStr);
  });

  // Calculation todo item count
  displayListCount(data);

  // Define actived taskbar display button
  addActivedClass(activeClass || "display-list__all");

  // Set data local Storage
  if (!noSetItem) localStorage.setItem("data", JSON.stringify(data));

  //   Init function
  initInput();
};

export const gettingStartedCallFunc = function (data) {
  data = JSON.parse(localStorage.getItem("data"));
  if (!data) data = [];

  update(data);
  return data;
};

export default update;
