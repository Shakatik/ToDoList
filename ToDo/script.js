containerRender();
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
clearButtonView()


function render() {
  taskList.innerHTML = "";
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
      clearButtonView();
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
  let activeTaskCount = initialData.reduce((acc, item) => {
    return acc + (item.isChecked === false ? 1 : 0);
  }, 0);
  taskCount.textContent = `${activeTaskCount} ${
    activeTaskCount === 1 ? "item" : "items"
  } left`;
  console.log(renderData);
}

function edit() {
  if (isEditing) return;
  const input = document.createElement("input");
  input.value = p.textContent;
  input.classList.add("input__task__change");
  p.style.visibility = "none";
  input.style.visibility = "block";
  input.focus();

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const edited = input.value;
      const p = document.createElement("p");
      p.style.visibility = "block";
      input.style.visibility = "none";
      const newText = renderData.find((item) => item.id === element.id);
      if (edited) {
        newText.value = edited;
        localStorage.setItem("array", JSON.stringify(initialData));
        p.classList.add("task__text");
      }
      isEditing = false;
      render()
    }
  })
}
function paragraphEdit () {
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
      }
      isEditing = false;
      render()
    }
  });
};



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
  clearButtonView();
  render();
});

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    makeElement();
    console.log("enter");
  }
});

function makeElement() {
  const newTaskData = {
    id: objectId++,
    value: input.value,
    creationDate: Date.now(),
    isChecked: false,
  };
  if (input.value.trim() === "") {
    return;
  } else {
    input.value = "";
    addItem(newTaskData);
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
  filterButtons.forEach((button) => button.classList.remove("filter__active"));
  filterItemsByType(target.dataset.type);
  target.classList.add("filter__active");
};

filterButtons.forEach((button) => {
  button.addEventListener("click", onFilterClick);
  if (button.dataset.type === filterType) {
    button.classList.add("filter__active");
  }
});

function clearButtonView() {
  const hasCheckedItem = renderData.some(obj => obj.isChecked);
  console.log(hasCheckedItem)
  if (hasCheckedItem === true) {
    completeCleanButton.style.visibility = "visible";
  } else {
    completeCleanButton.style.visibility = "hidden";
  }
  render()
} 



function containerRender() {
  const containerMain = document.createElement("div");
  containerMain.classList.add("container__main");

  const header = document.createElement("header");
  header.classList.add("header");

  const h1 = document.createElement("h1");
  h1.classList.add("banner");
  h1.textContent = "ToDo";

  const divInputSpace = document.createElement("div");
  divInputSpace.classList.add("input__space");

  const buttonCheckAll = document.createElement("button");
  buttonCheckAll.classList.add("check__all");
  buttonCheckAll.textContent = "❯";

  const input = document.createElement("input");
  input.setAttribute("id", "input");
  input.setAttribute("type", "text");
  input.classList.add("input__add");
  input.setAttribute("placeholder", "Your tasks");
  input.setAttribute("autofocus", "");

  divInputSpace.appendChild(buttonCheckAll);
  divInputSpace.appendChild(input);

  header.appendChild(h1);
  header.appendChild(divInputSpace);

  const containerTask = document.createElement("div");
  containerTask.classList.add("container__task");

  const ulTaskList = document.createElement("ul");
  ulTaskList.classList.add("task__list");

  containerTask.appendChild(ulTaskList);

  const footer = document.createElement("footer");
  footer.classList.add("footer");

  const spanTaskCount = document.createElement("span");
  spanTaskCount.classList.add("task__count");
  spanTaskCount.textContent = "Items";

  const ulButtons = document.createElement("ul");

  const buttonAll = document.createElement("button");
  buttonAll.classList.add("button__filter");
  buttonAll.setAttribute("data-type", "all__item");
  buttonAll.textContent = "All";

  const buttonActive = document.createElement("button");
  buttonActive.classList.add("button__filter");
  buttonActive.setAttribute("data-type", "active__item");
  buttonActive.textContent = "Active";

  const buttonComplete = document.createElement("button");
  buttonComplete.classList.add("button__filter");
  buttonComplete.setAttribute("data-type", "completed__item");
  buttonComplete.textContent = "Complete";

  ulButtons.appendChild(buttonAll);
  ulButtons.appendChild(buttonActive);
  ulButtons.appendChild(buttonComplete);

  const buttonClearCompleted = document.createElement("button");
  buttonClearCompleted.setAttribute("id", "allCompleteCleanButton");
  buttonClearCompleted.classList.add("button__clear__completed");
  buttonClearCompleted.textContent = "Clear completed";

  footer.appendChild(spanTaskCount);
  footer.appendChild(ulButtons);
  footer.appendChild(buttonClearCompleted);

  containerMain.appendChild(header);
  containerMain.appendChild(containerTask);
  containerMain.appendChild(footer);

  document.body.appendChild(containerMain);
}

let x = 3;
function fn() {
    x = 10;
    return;
    function x() {}
}

fn();
console.log(x);