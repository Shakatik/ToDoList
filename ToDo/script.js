const filterButtons = document.querySelectorAll(".button__filter");
const taskCount = document.querySelector(".task__count");
const input = document.querySelector("input");
const taskList = document.querySelector(".task__list");
const checkAll = document.querySelector(".check__all");
const completeCleanButton = document.getElementById("allCompleteCleanButton");
const footer = document.querySelector("footer");
let filterType = localStorage.getItem("filter-type") || "all__item";
let initialData = JSON.parse(localStorage.getItem("array")) || [];
let renderData = [...initialData];
let objectId = parseInt(localStorage.getItem("objectId")) || 0;
let isEditing = false;

filterItemsByType(filterType);
render();

function render() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((item) => {
    item.remove();
  });
  footer.style.visibility = "visible";
  renderData.forEach((element) => {
    console.log(element);
    const completeSwitch = document.createElement("button");
    completeSwitch.classList.add("complete__switch");
    if (element.isChecked) {
      completeSwitch.classList.add("switch__active");
    }
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("button__delete");
    const p = document.createElement("p");
    p.textContent = element.value;
    p.classList.add("task__text");

    p.addEventListener("dblclick", function paragraphEdit () {
      if (isEditing) return; // Игнорировать если уже отредачено
      isEditing = true;
      const input = document.createElement("input");
      input.value = p.textContent;
      p.parentNode.replaceChild(input, p);
      input.focus();

      input.classList.add("input__task__change");
      input.focus();
      completeSwitch.style.display = "none";
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
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
          isEditing = false;
          render()
        }
      });
    });

    const div = document.createElement("div");
    div.classList.add("task");
    div.prepend(completeSwitch);
    div.append(p, deleteButton);

    completeSwitch.addEventListener("click", function () {
      if (completeSwitch.classList.contains("switch__active")) {
        completeSwitch.classList.remove("switch__active");
        element.isChecked = false;
      } else {
        completeSwitch.classList.add("switch__active");
        element.isChecked = true;
      }
      localStorage.setItem("array", JSON.stringify(initialData));
      filterItemsByType(filterType);
      render();
    });

    deleteButton.addEventListener("click", function () {
      initialData = initialData.filter((item) => item.id !== element.id);
      renderData = [...initialData];
      localStorage.setItem("array", JSON.stringify(initialData));
      render();
    });
    taskList.appendChild(div);
  });

  if (initialData.length === 0) {
    footer.style.visibility = "hidden";
  }
  console.log(initialData);
  let activeTaskCount = initialData.reduce((acc, item) => {
    return acc + (item.isChecked === false ? 1 : 0);
  }, 0);
  taskCount.textContent = `${activeTaskCount} ${
    activeTaskCount === 1 ? "item" : "items"
  } left`;
}

function edit() {
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
}

checkAll.addEventListener("click", function () {
  const allChecked = renderData.every((element) => element.isChecked);
  checkAll.classList.remove("check__all_active");
  if (allChecked) {
    renderData.forEach((element) => {
      element.isChecked = false;
    });
  } else {
    renderData.forEach((element) => {
      element.isChecked = true;
      checkAll.classList.add("check__all_active");
    });
  }
  localStorage.setItem("array", JSON.stringify(initialData));
  render();
});

completeCleanButton.addEventListener("click", function () {
  initialData = initialData.filter((item) => !item.isChecked);
  renderData = [...initialData];
  localStorage.setItem("array", JSON.stringify(initialData));
  render();
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
  if (input.value.trim() === "") {
    return;
  } else {
    input.value = "";
    addItem(taskData);
  }
}

function addItem(newItem) {
  initialData.push(newItem);
  renderData = [...initialData];
  filterItemsByType(filterType);
  localStorage.setItem("array", JSON.stringify(initialData));
  localStorage.setItem("objectId", objectId);
  render();
}

function filterItemsByType(Type) {
  filterType = Type;
  localStorage.setItem("filter-type", filterType);
  console.log(filterType);
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
  filterButtons.forEach((button) => button.classList.remove("filter__active"));
  filterItemsByType(dataType);
  target.classList.add("filter__active");
};

filterButtons.forEach((button) => {
  button.addEventListener("click", onFilterClick);
  if (button.dataset.type === filterType) {
    button.classList.add("filter__active");
  }
});
