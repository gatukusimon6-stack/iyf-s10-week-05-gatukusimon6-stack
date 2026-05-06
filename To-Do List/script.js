// =======================
// STATE
// =======================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";


// =======================
// DOM ELEMENTS
// =======================
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalEl = document.getElementById("total");
const activeEl = document.getElementById("active");
const completedEl = document.getElementById("completed");

const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clearCompleted");


// =======================
// LOCAL STORAGE
// =======================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


// =======================
// ADD TASK
// =======================
function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    text,
    completed: false
  });

  input.value = "";

  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});


// =======================
// RENDER TASKS
// =======================
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task) => {
    const index = tasks.indexOf(task); // FIXED INDEX ISSUE

    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? "checked" : ""} />
        <span>${task.text}</span>
      </div>
      <span class="delete">✖</span>
    `;

    // Toggle complete
    li.querySelector("input").addEventListener("change", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    // Delete task
    li.querySelector(".delete").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  updateStats();
}


// =======================
// STATS
// =======================
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  totalEl.textContent = total;
  activeEl.textContent = active;
  completedEl.textContent = completed;
}


// =======================
// FILTERS
// =======================
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});


// =======================
// CLEAR COMPLETED
// =======================
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);

  saveTasks();
  renderTasks();
});


// =======================
// INIT APP
// =======================
renderTasks();