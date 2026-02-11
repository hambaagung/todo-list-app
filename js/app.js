// ================= DATA =================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [
  { id: 1, name: "Umum", color: "#2196f3", icon: "📌" }
];

let activeFilter = null;

// ================= ELEMENT =================
const categoryForm = document.getElementById("categoryForm");
const categoryList = document.getElementById("categoryList");
const categorySelect = document.getElementById("categorySelect");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const filterCategory = document.getElementById("filterCategory");

const categoryName = document.getElementById("categoryName");
const categoryColor = document.getElementById("categoryColor");
const categoryIcon = document.getElementById("categoryIcon");

const taskInput = document.getElementById("taskInput");

// ================= SAVE =================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveCategories() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

// ================= CATEGORY =================
function renderCategories() {
  categorySelect.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = `${cat.icon} ${cat.name}`;
    categorySelect.appendChild(option);
  });
}

function renderCategoryList() {
  categoryList.innerHTML = "";

  categories.forEach(cat => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span style="color:${cat.color}">
        ${cat.icon} ${cat.name}
      </span>
      <div>
        <button onclick="editCategory(${cat.id})">✏</button>
        <button onclick="deleteCategory(${cat.id})">❌</button>
      </div>
    `;
    categoryList.appendChild(li);
  });
}

categoryForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = categoryName.value.trim();
  const color = categoryColor.value;
  const icon = categoryIcon.value.trim();

  if (!name || !icon) {
    alert("Semua field wajib diisi");
    return;
  }

  const newCategory = {
    id: Date.now(),
    name,
    color,
    icon
  };

  categories.push(newCategory);
  saveCategories();
  renderAll();

  categoryForm.reset();
});

function editCategory(id) {
  const category = categories.find(cat => cat.id === id);
  if (!category) return;

  const newName = prompt("Edit nama kategori:", category.name);
  const newIcon = prompt("Edit icon kategori:", category.icon);
  const newColor = prompt("Edit warna kategori (contoh: #ff0000):", category.color);

  if (!newName || !newIcon || !newColor) return;

  category.name = newName.trim();
  category.icon = newIcon.trim();
  category.color = newColor.trim();

  saveCategories();
  renderAll();
}

function deleteCategory(id) {
  categories = categories.filter(cat => cat.id !== id);

  // Hapus task yang pakai kategori ini
  tasks = tasks.filter(task => task.categoryId != id);

  saveCategories();
  saveTasks();
  renderAll();
}

// ================= TASK =================
taskForm.addEventListener("submit", e => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    alert("Task tidak boleh kosong");
    return;
  }

  const task = {
    id: Date.now(),
    text,
    categoryId: categorySelect.value,
    completed: false,
    reaction: ""
  };

  tasks.push(task);
  saveTasks();
  taskInput.value = "";
  renderTasks();
});

function renderTasks() {
  taskList.innerHTML = "";

  tasks
    .filter(task => !activeFilter || task.categoryId == activeFilter)
    .forEach(task => {

      const category = categories.find(cat => cat.id == task.categoryId) || {
        name: "Unknown",
        color: "#999",
        icon: "❓"
      };

      const li = document.createElement("li");
      li.className = "task";
      li.style.borderLeft = `5px solid ${category.color}`;

      li.innerHTML = `
        <span style="text-decoration:${task.completed ? 'line-through' : 'none'}">
          ${category.icon} ${task.text} ${task.reaction}
        </span>
        <div>
          <button onclick="toggleTask(${task.id})">✔</button>
          <button onclick="reactTask(${task.id})">😊</button>
          <button onclick="deleteTask(${task.id})">🗑</button>
        </div>
      `;

      taskList.appendChild(li);
    });
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function reactTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const emoji = prompt("Masukkan emoji reaksi:");
  if (!emoji) return;

  task.reaction = emoji;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// ================= FILTER =================
function renderFilterButtons() {
  filterCategory.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.textContent = "Semua";
  allBtn.onclick = () => {
    activeFilter = null;
    renderTasks();
  };
  filterCategory.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = `${cat.icon} ${cat.name}`;
    btn.style.backgroundColor = cat.color;
    btn.style.color = "white";

    btn.onclick = () => {
      activeFilter = cat.id;
      renderTasks();
    };

    filterCategory.appendChild(btn);
  });
}

// ================= RENDER ALL =================
function renderAll() {
  renderCategories();
  renderCategoryList();
  renderFilterButtons();
  renderTasks();
}

// ================= INIT =================
renderAll();
