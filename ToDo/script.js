const filterButtons = document.querySelectorAll(".button__filter");
const taskCount = document.querySelector(".task__count")
const input = document.querySelector("input");
const taskList = document.querySelector(".task__list");
const checkAll = document.querySelector(".check__all");
const completeCleanButton = document.getElementById("allCompleteCleanButton");
let filterType = localStorage.getItem("filter-type") || "all__item";
let initialData = JSON.parse(localStorage.getItem("array")) || [];
let renderData = [...initialData];
let objectId = parseInt(localStorage.getItem("objectId")) || 0;
filterItemsByType(filterType);
render();

function render() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((item) => {
    item.remove();
  });

  renderData.forEach((element) => {
    console.log(element);
    const completeToggle = document.createElement("button");
    completeToggle.classList.add("complete__toggle");
    if (element.isChecked) {
      completeToggle.classList.add("toggle__active");
    }
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("button__delete");
    const p = document.createElement("p");
    p.textContent = element.value;
    p.classList.add("task__text");

    p.addEventListener("dblclick", function () {
      const input = document.createElement("input");
      input.value = p.textContent;
      p.parentNode.replaceChild(input, p);
      input.focus;

      input.classList.add("input__task__change");
      input.focus;
      input.addEventListener("blur", function () {
        const edited = input.value;
        const p = document.createElement("p");
        input.parentNode.replaceChild(p, input);
        const newText = renderData.find((item) => item.id === element.id);
        if (edited) {
          newText.value = edited;
          localStorage.setItem("array", JSON.stringify(initialData));
          p.classList.add("task__text");
          render();
        }
      });
    });

    const div = document.createElement("div");
    div.classList.add("task");
    div.prepend(completeToggle);
    div.append(p, deleteButton);

    completeToggle.addEventListener("click", function () {
      if (completeToggle.classList.contains("toggle__active")) {
        completeToggle.classList.remove("toggle__active");
        element.isChecked = false;
      } else {
        completeToggle.classList.add("toggle__active");
        element.isChecked = true;
      }
      localStorage.setItem("array", JSON.stringify(initialData));
      render();
    });

    deleteButton.addEventListener("click", function () {
      initialData = initialData.filter((item) => item.id !== element.id);
      renderData = [...initialData];
      render();
      localStorage.setItem("array", JSON.stringify(initialData));
    });
    const itemText = renderData.length === 1 ? "item" : "items"
    taskCount.textContent = `${renderData.length} ${itemText} left`
    taskList.appendChild(div);
  });
}

checkAll.addEventListener("click", function () {
  const allChecked = renderData.every((element) => element.isChecked);
  if (allChecked) {
    renderData.forEach((element) => {
      element.isChecked = false;
    });
  } else {
    renderData.forEach((element) => {
      element.isChecked = true;
    });
  }
  localStorage.setItem("array", JSON.stringify(initialData));
  render();
});

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
  filterItemsByType(filterType)
  render();
  localStorage.setItem("array", JSON.stringify(initialData));
  localStorage.setItem("objectId", objectId);
}



function filterItemsByType(Type) {
  filterType = Type;


  localStorage.setItem("filter-type", filterType);
  console.log(filterType)
  if (filterType === "completed__item") {
    renderData = initialData.filter((item) => item.isChecked === true);
  } else if (filterType === "active__item") {
    renderData = initialData.filter((item) => item.isChecked === false);
  } else {
    renderData = initialData;
  }
  render();
}

const onFilterClick = (event) => {
  const target = event.target;
  const dataType = target.dataset.type;
  filterButtons.forEach((button) => button.classList.remove("filter__active"))
  filterItemsByType(dataType);
  target.classList.add("filter__active")
};


filterButtons.forEach((button) => {
  button.addEventListener("click", onFilterClick);
  if (button.dataset.type === filterType) {
    button.classList.add("filter__active");
  }
}); 
