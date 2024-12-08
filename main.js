const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const addTaskButton = document.getElementById("addTaskButton");
const taskSound = document.getElementById("taskSound");
const tasksContainer = document.getElementById("tasksContainer");
const tabs = document.querySelectorAll(".tab");

let tasks = []; // جميع المهام
let favorites = []; // المهام المفضلة

// فتح وإغلاق القائمة الجانبية
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// إغلاق القائمة عند النقر خارجها
document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
    sidebar.classList.remove("open");
  }
});

// التبديل بين التبويبات
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    filterTasks(tab.id);
  });
});

// إضافة مهمة جديدة
addTaskButton.addEventListener("click", () => {
  const taskText = prompt("أدخل نص المهمة:");
  if (taskText) {
    const activeTab = document.querySelector(".tab.active").id;
    const newTask = {
      id: Date.now(), // معرف فريد لكل مهمة
      text: taskText, // نص المهمة
      category: activeTab, // الفئة (هام، مخطط، إلخ)
      favorite: false, // الحالة الافتراضية
    };
    tasks.push(newTask); // إضافة المهمة للمصفوفة
    filterTasks(activeTab); // تحديث العرض
    taskSound.play(); // تشغيل صوت
  }
});

// تصفية المهام حسب الفئة
function filterTasks(category) {
  let filteredTasks;
  if (category === "tasksTab") {
    filteredTasks = tasks; // عرض جميع المهام
  } else if (category === "favoritesTab") {
    filteredTasks = favorites; // عرض المفضلة فقط
  } else {
    filteredTasks = tasks.filter((task) => task.category === category); // تصفية حسب الفئة
  }
  renderTasks(filteredTasks); // تحديث المهام
}

// عرض المهام
function renderTasks(filtered = tasks) {
  tasksContainer.innerHTML = ""; // مسح المهام القديمة
  if (filtered.length === 0) {
    tasksContainer.innerHTML = `<p class="placeholder">لا توجد مهام هنا.</p>`;
    return;
  }

  filtered.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className = "task";

    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    const buttons = document.createElement("div");
    buttons.className = "buttons";

    const editButton = document.createElement("button");
    editButton.className = "btn-edit";
    editButton.innerHTML = `<i class="fas fa-edit"></i> `;
    editButton.addEventListener("click", () => editTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete";
    deleteButton.innerHTML = `<i class="fas fa-trash-alt"></i> `;
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    const favoriteButton = document.createElement("button");
    favoriteButton.className = `btn-favorite ${task.favorite ? "favorited" : ""}`;
    favoriteButton.innerHTML = task.favorite
      ? `<i class="fas fa-star"></i>`
      : `<i class="far fa-star"></i>`;
    favoriteButton.addEventListener("click", () => toggleFavorite(task.id));

    buttons.appendChild(editButton);
    buttons.appendChild(deleteButton);
    buttons.appendChild(favoriteButton);

    taskElement.appendChild(taskText);
    taskElement.appendChild(buttons);

    tasksContainer.appendChild(taskElement);
  });
}

// تعديل المهمة
function editTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  const newText = prompt("أدخل النص الجديد:", task.text);
  if (newText) {
    task.text = newText;
    filterTasks(document.querySelector(".tab.active").id);
  }
}

// حذف المهمة
function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  favorites = favorites.filter((t) => t.id !== taskId);
  filterTasks(document.querySelector(".tab.active").id);
}

// تفضيل أو إلغاء تفضيل المهمة
function toggleFavorite(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  task.favorite = !task.favorite;
  if (task.favorite) {
    favorites.push(task);
  } else {
    favorites = favorites.filter((t) => t.id !== taskId);
  }
  filterTasks(document.querySelector(".tab.active").id);
}