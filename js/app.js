// ================== STORAGE ==================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [
  { id: 1, name: "Umum", color: "#00f5ff", icon: "📌" }
];

// ================== ELEMENT ==================
const categoryForm = document.getElementById("categoryForm");
const categoryList = document.getElementById("categoryList");
const categorySelect = document.getElementById("categorySelect");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const filterCategory = document.getElementById("filterCategory");
const searchInput = document.getElementById("searchInput");
const totalTask = document.getElementById("totalTask");
const completedTask = document.getElementById("completedTask");
const pendingTask = document.getElementById("pendingTask");

// ================== STATE ==================
let activeCategoryFilter = null;
let activeStatusFilter = "all";

// ================== SAVE ==================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveCategories() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

// ================== RENDER CATEGORY SELECT ==================
function renderCategories() {
  categorySelect.innerHTML = "";

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = `${cat.icon} ${cat.name}`;
    categorySelect.appendChild(option);
  });
}

// ================== RENDER CATEGORY LIST ==================
function renderCategoryList() {
  categoryList.innerHTML = "";

  categories.forEach(cat => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span style="color:${cat.color || "#00f5ff"}">
        ${cat.icon} ${cat.name}
      </span>
      <button onclick="deleteCategory(${cat.id})">❌</button>
    `;
    categoryList.appendChild(li);
  });
}

// ================== DELETE CATEGORY ==================
function deleteCategory(id) {
  categories = categories.filter(cat => cat.id !== id);
  tasks = tasks.filter(task => task.categoryId != id);
  saveCategories();
  saveTasks();
  renderAll();
}

// ================== ADD CATEGORY ==================
categoryForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("categoryName").value.trim();
  const color = document.getElementById("categoryColor").value || "#00f5ff";
  const icon = document.getElementById("categoryIcon").value.trim();

  if (!name || !icon) return alert("Semua field wajib diisi");

  const newCategory = {
    id: Date.now(),
    name,
    color,
    icon
  };

  categories.push(newCategory);
  saveCategories();
  categoryForm.reset();
  renderAll();
});

// ================== ADD TASK ==================
taskForm.addEventListener("submit", e => {
  e.preventDefault();

  const text = document.getElementById("taskInput").value.trim();
  const categoryId = categorySelect.value;
  const deadline = document.getElementById("deadlineInput").value;

  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    categoryId,
    deadline,
    completed: false,
    reaction: ""
  };

  tasks.push(task);
  saveTasks();
  taskForm.reset();
  renderAll();
});

// ================== TOGGLE TASK ==================
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderAll();
}

// ================== DELETE TASK ==================
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderAll();
}

// ================== EDIT TASK ==================
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit task:", task.text);
  if (!newText) return;

  task.text = newText;
  saveTasks();
  renderAll();
}

// ================== REACT TASK ==================
function reactTask(id) {
  const emoji = prompt("Masukkan emoji reaksi:");
  if (!emoji) return;

  tasks = tasks.map(task =>
    task.id === id ? { ...task, reaction: emoji } : task
  );
  saveTasks();
  renderAll();
}

// ================== RENDER FILTER ==================
function renderFilterButtons() {
  filterCategory.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.textContent = "Semua";
  allBtn.onclick = () => {
    activeCategoryFilter = null;
    renderAll();
  };
  filterCategory.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = `${cat.icon} ${cat.name}`;
    btn.style.background = cat.color || "#00f5ff";
    btn.onclick = () => {
      activeCategoryFilter = cat.id;
      renderAll();
    };
    filterCategory.appendChild(btn);
  });
}

// ================== STATUS FILTER ==================
document.querySelectorAll(".filter-status button").forEach(btn => {
  btn.addEventListener("click", () => {
    activeStatusFilter = btn.dataset.status;
    renderAll();
  });
});

// ================== SEARCH ==================
searchInput.addEventListener("input", () => {
  renderAll();
});

// ================== RENDER TASK ==================
function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks;

  if (activeCategoryFilter) {
    filtered = filtered.filter(
      task => task.categoryId == activeCategoryFilter
    );
  }

  if (activeStatusFilter === "completed") {
    filtered = filtered.filter(task => task.completed);
  }

  if (activeStatusFilter === "pending") {
    filtered = filtered.filter(task => !task.completed);
  }

  if (searchInput.value) {
    filtered = filtered.filter(task =>
      task.text.toLowerCase().includes(searchInput.value.toLowerCase())
    );
  }

  filtered.forEach(task => {
    const category = categories.find(cat => cat.id == task.categoryId);

    const li = document.createElement("li");
    li.className = "task";
    li.style.borderLeft = `5px solid ${category?.color || "#00f5ff"}`;

    li.innerHTML = `
      <span style="text-decoration:${task.completed ? "line-through" : "none"}">
        ${category?.icon || "📌"} ${task.text} ${task.reaction || ""}
        ${task.deadline ? `<small>📅 ${task.deadline}</small>` : ""}
      </span>
      <div>
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="editTask(${task.id})">✏</button>
        <button onclick="reactTask(${task.id})">😊</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// ================== STATISTICS ==================
function updateStats() {
  totalTask.textContent = tasks.length;
  completedTask.textContent = tasks.filter(t => t.completed).length;
  pendingTask.textContent = tasks.filter(t => !t.completed).length;
}

// ================== MASTER RENDER ==================
function renderAll() {
  renderCategories();
  renderCategoryList();
  renderFilterButtons();
  renderTasks();
  updateStats();
}

// ================== INIT ==================
renderAll();
