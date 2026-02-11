let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [
  { id: 1, name: "Umum", color: "#2196f3", icon: "📌" }
];
const categorySelect = document.getElementById("categorySelect");

function renderCategories() {
  categorySelect.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = `${cat.icon} ${cat.name}`;
    categorySelect.appendChild(option);
  });
}

renderCategories();
document.getElementById("taskForm").addEventListener("submit", e => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return alert("Task tidak boleh kosong");

  const task = {
    id: Date.now(),
    text,
    categoryId: categorySelect.value,
    completed: false,
    reaction: ""
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  renderTasks();
});
const taskList = document.getElementById("taskList");

function renderTasks(filterId = null) {
  taskList.innerHTML = "";

  tasks
    .filter(t => !filterId || t.categoryId == filterId)
    .forEach(task => {
      const li = document.createElement("li");
      li.className = "task";
      li.innerHTML = `
        <span style="text-decoration:${task.completed ? 'line-through' : 'none'}">
          ${task.text} ${task.reaction}
        </span>
        <div>
          <button onclick="toggleTask(${task.id})">✔</button>
          <button onclick="reactTask(${task.id})">😊</button>
        </div>
      `;
      taskList.appendChild(li);
    });
}

renderTasks();
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}
function reactTask(id) {
  const emoji = prompt("Masukkan emoji:");
  if (!emoji) return;

  const task = tasks.find(t => t.id === id);
  task.reaction = emoji;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}
