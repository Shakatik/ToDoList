const filterButtons = document.querySelectorAll(".button__filter");
const input = document.querySelector("input");
const taskList = document.querySelector(".task__list");
const checkAll = document.querySelector(".check__all")
const completeCleanButton = document.getElementById("allCompleteCleanButton");
let initialData = JSON.parse(localStorage.getItem("array")) || [];
let renderData = [...initialData];
let objectId = parseInt(localStorage.getItem("objectId")) || 0;
let isChecked = localStorage.getItem("isChecked");
render();

function render() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((item) => {
    item.remove();
  });

  renderData.forEach((element) => {
    console.log(element)
    const completeToggle = document.createElement("button");
    completeToggle.classList.add("complete__toggle");
    if (element.isChecked) {
      completeToggle.classList.add("toggle__active");
    }
    // completeToggle.checked = element.isChecked; 
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("button__delete");
    const p = document.createElement("p");
    p.textContent = element.value;
    p.classList.add("task__text");
    const div = document.createElement("div");
    div.classList.add("task");
    div.prepend(completeToggle);
    div.append(p, deleteButton);



    completeToggle.addEventListener("click", function () { 
      if (completeToggle.classList.contains("toggle__active")) {
        completeToggle.classList.remove("toggle__active");
        element.isChecked = false;
      } else {
        completeToggle.classList.add("toggle__active")
        element.isChecked = true;
    }
    localStorage.setItem("array", JSON.stringify(initialData));
    render()
    });

    deleteButton.addEventListener("click", function () {
      initialData = initialData.filter((item) => item.id !== element.id);
      renderData = [...initialData];
      render();
      localStorage.setItem("array", JSON.stringify(initialData));
    });

    taskList.appendChild(div);
  });
}

// checkAll.addEventListener("click", function () {

//   // initialData = initialData.filter((item) => !item.isChecked = );
//   // renderData = [...initialData];
//   render();
//   localStorage.setItem("array", JSON.stringify(initialData));
// });

completeCleanButton.addEventListener("click", function () {
  initialData = initialData.filter((item) => !item.isChecked);
  renderData = [...initialData];
  render();
  localStorage.setItem("array", JSON.stringify(initialData));
});

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    makeElement();
    console.log("enter");
  }
});

function makeElement() {
  const taskData = {
    id: objectId++,
    value: input.value,
    creationDate: Date.now(),
    isChecked: false,
  };
  if (input.value === "") {
    alert("Введите значение");
  } else {
    input.value = "";
    addItem(taskData);
  }
}

function addItem(newItem) {
  initialData.push(newItem);
  renderData = [...initialData];
  render();
  localStorage.setItem("array", JSON.stringify(initialData));
  localStorage.setItem("objectId", objectId);
}

