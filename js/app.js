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
const filterCategory = document.getElementById("filterCategory");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// optional (kalau ada di HTML)
const deadlineInput = document.getElementById("deadlineInput");
const searchInput = document.getElementById("searchInput");

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
      <button onclick="deleteCategory(${cat.id})">❌</button>
    `;
    categoryList.appendChild(li);
  });
}

categoryForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = categoryName.value.trim();
  const color = categoryColor.value;
  const icon = categoryIcon.value.trim();

  if (!name || !icon) return alert("Semua field wajib diisi");

  categories.push({
    id: Date.now(),
    name,
    color,
    icon
  });

  saveCategories();
  renderCategories();
  renderCategoryList();
  renderFilterButtons();

  categoryForm.reset();
});

function deleteCategory(id) {
  categories = categories.filter(cat => cat.id !== id);

  // hapus task yang kategorinya ikut terhapus
  tasks = tasks.filter(task => task.categoryId != id);

  saveCategories();
  saveTasks();
  renderCategories();
  renderCategoryList();
  renderFilterButtons();
  renderTasks();
}

// ================= TASK =================
taskForm.addEventListener("submit", e => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return alert("Task tidak boleh kosong");

  tasks.push({
    id: Date.now(),
    text,
    categoryId: categorySelect.value,
    deadline: deadlineInput ? deadlineInput.value : null,
    completed: false,
    reaction: ""
  });

  saveTasks();
  taskInput.value = "";
  if (deadlineInput) deadlineInput.value = "";

  renderTasks();
  renderStats();
});

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task =>
    !activeFilter || task.categoryId == activeFilter
  );

  if (searchInput && searchInput.value) {
    filteredTasks = filteredTasks.filter(task =>
      task.text.toLowerCase().includes(searchInput.value.toLowerCase())
    );
  }

  filteredTasks.forEach(task => {
    const category = categories.find(cat => cat.id == task.categoryId);
    if (!category) return;

    const li = document.createElement("li");
    li.className = "task";
    li.style.borderLeft = `5px solid ${category.color}`;

    li.innerHTML = `
      <div>
        <span style="text-decoration:${task.completed ? "line-through" : "none"}">
          ${category.icon} ${task.text}
        </span>
        ${task.deadline ? `<small> (Deadline: ${task.deadline})</small>` : ""}
        ${task.reaction}
      </div>
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
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
  renderStats();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
  renderStats();
}

function reactTask(id) {
  const emoji = prompt("Masukkan emoji reaksi:");
  if (!emoji) return;

  tasks = tasks.map(task =>
    task.id === id ? { ...task, reaction: emoji } : task
  );

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

// ================= SEARCH =================
if (searchInput) {
  searchInput.addEventListener("input", renderTasks);
}

// ================= STATS =================
function renderStats() {
  const stats = document.getElementById("stats");
  if (!stats) return;

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  stats.innerHTML = `
    Total Task: ${total} |
    Selesai: ${completed} |
    Belum: ${total - completed}
  `;
}

// ================= INIT =================
renderCategories();
renderCategoryList();
renderFilterButtons();
renderTasks();
renderStats();
