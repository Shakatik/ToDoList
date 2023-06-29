fetch('https://dummyjson.com/todos?limit=3')
.then(res => res.json())
.then(console.log);