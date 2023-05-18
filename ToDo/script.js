console.log("sadad")

const filterButtons = document.querySelectorAll(".button__filter");


let initialData = JSON.parse(localStorage.getItem("array")) || [];
let renderData = [...initialData];
