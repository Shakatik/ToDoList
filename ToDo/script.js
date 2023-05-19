

const filterButtons = document.querySelectorAll(".button__filter");
const input = document.querySelector("input");
const taskList = document.querySelector(".task__list");
let initialData = JSON.parse(localStorage.getItem("array")) || [];
let renderData = [...initialData];
let objectId = parseInt(localStorage.getItem("objectId")) || 0;

render();
function render() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((item) => {
    item.remove();
  });

  renderData.forEach((element) => {
    console.log(element)
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("button__delete");
    const div = document.createElement("div");
    div.textContent = element.value;
    div.classList.add("task");
    div.append(deleteButton);
    deleteButton.addEventListener("click", function remove() {

      initialData = initialData.filter((item) => item.id !== element.id);

      renderData = [...initialData];
      render();
      localStorage.setItem("array", JSON.stringify(initialData));
    });
    taskList.appendChild(div);
  });
}

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // код который будет выполняться при нажатии Enter в поле ввода
    makeElement();
    console.log("enter");
  }
});

function makeElement() {
  const taskData = {
    id: objectId++,
    value: input.value,
    creationDate: Date.now(),
  };
  if (input.value === "") {
    alert("Введите значение");
  } else {
    // Функция добавления элемента в массив initial
    input.value = "";
    addItem(taskData);
  }

}

function addItem(newItem) {
  initialData.push(newItem);
  renderData = [...initialData];
  render();
  localStorage.setItem("array", JSON.stringify(initialData));
  localStorage.setItem("objectId", objectId)
}
