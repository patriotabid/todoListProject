import * as HTMLel from "./src/html.js";
import update, * as Functions from "./src/functions.js";

// VARIABLE:
let dataList, newDataListAftedDeleteTodo;
let message = {
  emptyInput: "Please write something",
  deleteTodoItem: "Do you sure want to delete this task?",
  deleteAllTodoList: "Do you sure want to delete all tasks?",
  deleteCompletedTodoList: "Do you sure want to delete completed tasks?",
  noneSearchedTodo: "The task you are looking for is not available",
};

// GETTING STARTED with the SITE
dataList = Functions.gettingStartedCallFunc(dataList);

// MAIN JS: ...............................................................................................................
HTMLel.formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!Functions.checkInput(HTMLel.inputEl)) return alert(message.emptyInput);

  // Created new id
  const todoItemId = Functions.getTodoItemId();

  //   Push data new todo item
  const newTodoItem = {
    title: HTMLel.inputEl.value,
    clicked: false,
    id: todoItemId,
  };
  dataList.push(newTodoItem);

  //   Update
  update(dataList);
});

// .........................................................................SEARCH TODO LIST
HTMLel.btnSearchTodoItem.addEventListener("click", function () {
  if (!Functions.checkInput(HTMLel.inputEl)) return alert(message.emptyInput);

  // Find the searched todo element
  const searchedTodoItem = HTMLel.inputEl.value;

  const findedTodoItem = dataList.find(
    (todo) => todo.title === searchedTodoItem
  );

  // if this item is not available
  if (!findedTodoItem) return alert(message.noneSearchedTodo);

  // Show searched todo item
  Functions.showSearchedTodo(findedTodoItem);

  // Init input value
  Functions.initInput();
});

// .........................................................................TODO LIST CONTAINER
HTMLel.todoListEl.addEventListener("click", function (e) {
  const todoItemEl = e.target.closest(".todo-item");

  // Find clicked todo item
  if (e.target.closest(".todo-item--title")) {
    // If item is editing don't complete it
    if (todoItemEl.classList.contains("todo-item--editing")) return;

    const clickedTodoItem = dataList.find(
      (todo) => `todo-item${todo.id}` === todoItemEl.id
    );
    clickedTodoItem.clicked = !clickedTodoItem.clicked;

    // Update todo list
    update(dataList);
  }

  // Find to delete todo item
  if (e.target.closest(".todo-item__buttons--delete")) {
    // Display alert window
    Functions.displayAlertWindow(true);
    // Create new array for display todo list
    HTMLel.alertMessageTextEl.textContent = message.deleteTodoItem;

    newDataListAftedDeleteTodo = dataList.filter(
      (todo) => `todo-item${todo.id}` !== todoItemEl.id
    );

    // Update todo list
    update(dataList);
  }

  // Find to edit todo item
  if (e.target.closest(".todo-item__buttons--edit")) {
    const clickedTodoItem = dataList.find(
      (todo) => `todo-item${todo.id}` === todoItemEl.id
    );
    console.log(clickedTodoItem);

    // Find to edit todo item
    const clickedInputEl = document.querySelector(
      `#todo--input${clickedTodoItem.id}`
    );
    const editBtn = document.querySelector(`#todo--edit${clickedTodoItem.id}`);

    // Delete to edit readonly attr
    if (clickedInputEl.attributes.readonly) {
      Functions.addEditingClass(todoItemEl, true);
      Functions.addEditingClass(clickedInputEl, true);

      clickedInputEl.removeAttribute("readonly");
      editBtn.textContent = "save";
      clickedInputEl.focus();

      return;
    }

    // Add to save readonly attr
    if (!clickedInputEl.attributes.readonly) {
      clickedTodoItem.title = clickedInputEl.value;

      Functions.addEditingClass(todoItemEl, false);
      Functions.addEditingClass(clickedInputEl, false);

      clickedInputEl.setAttribute("readonly", true);
      editBtn.textContent = "edit";

      // Update todo list
      update(dataList);
      return;
    }
  }
});

// ...............................................................................TASKBAR BUTTONS
HTMLel.taskbarBtnElements.forEach(function (taskbarBtnEl) {
  taskbarBtnEl.addEventListener("click", function (e) {
    let newList;
    let activeClass = e.target.classList.value.slice(17);

    if (e.target.closest(".display-list__all")) newList = dataList;
    if (e.target.closest(".display-list__active"))
      newList = dataList.filter((todo) => !todo.clicked);

    if (e.target.closest(".display-list__completed"))
      newList = dataList.filter((todo) => todo.clicked);

    if (e.target.closest(".delete-btn__completed")) {
      // Display alert window
      Functions.displayAlertWindow(true);
      HTMLel.alertMessageTextEl.textContent = message.deleteCompletedTodoList;

      // Create new data list after delete completed todo items
      newDataListAftedDeleteTodo = dataList.filter((todo) => !todo.clicked);
      return;
    }

    if (e.target.closest(".delete-btn__all")) {
      // Display alert window
      Functions.displayAlertWindow(true);
      HTMLel.alertMessageTextEl.textContent = message.deleteAllTodoList;

      // Create new data list after delete all todo list
      newDataListAftedDeleteTodo = [];
      return;
    }

    // Update
    update(newList, activeClass, true);
  });
});

// ...................................................................................WINDOW ALERT
HTMLel.windowAlert.addEventListener("click", function (e) {
  // Hidden alert window
  if (e.target.closest(".btn--cancel")) Functions.displayAlertWindow(false);

  if (e.target.closest(".btn--ok")) {
    Functions.displayAlertWindow(false);

    // Update todo list after delete todo item
    dataList = newDataListAftedDeleteTodo;
    update(newDataListAftedDeleteTodo);
  }
});
