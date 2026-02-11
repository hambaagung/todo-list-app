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
const categoryForm = document.getElementById("categoryForm");
const categoryList = document.getElementById("categoryList");

function saveCategories() {
  localStorage.setItem("categories", JSON.stringify(categories));
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

  const newCategory = {
    id: Date.now(),
    name,
    color,
    icon
  };

  categories.push(newCategory);
  saveCategories();
  renderCategories();
  renderCategoryList();

  categoryForm.reset();
});
function deleteCategory(id) {
  categories = categories.filter(cat => cat.id !== id);
  saveCategories();
  renderCategories();
  renderCategoryList();
}
renderCategoryList();
renderFilterButtons();
renderFilterButtons();

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
const filterCategory = document.getElementById("filterCategory");
let activeFilter = null;
function renderFilterButtons() {
  filterCategory.innerHTML = "";

  // Tombol Semua
  const allBtn = document.createElement("button");
  allBtn.textContent = "Semua";
  allBtn.onclick = () => {
    activeFilter = null;
    renderTasks();
  };
  filterCategory.appendChild(allBtn);

  // Tombol per kategori
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

renderTasks();
renderFilterButtons();

function renderTasks() {
  taskList.innerHTML = "";

  tasks
    .filter(task => !activeFilter || task.categoryId == activeFilter)
    .forEach(task => {

      const category = categories.find(cat => cat.id == task.categoryId);

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
        </div>
      `;

      taskList.appendChild(li);
    });
}

