// Отримуємо елементи сторінки
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
const clearDoneBtn = document.getElementById('clearDoneBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Масив завдань: [{ text: "...", done: false }, ...]
// Завантажуємо збережені завдання з localStorage (або порожній масив)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Зберігаємо масив завдань у localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Малюємо список завдань на сторінці
function render() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        // Фільтр: пропускаємо завдання, які не підходять
        if (currentFilter === 'active' && task.done) return;
        if (currentFilter === 'done' && !task.done) return;

        const li = document.createElement('li');
        li.className = 'task-item' + (task.done ? ' done' : '');

        // Чекбокс для позначення виконаного
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => toggleTask(index));

        // Текст завдання
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        // Кнопка видалення
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = '✕';
        delBtn.addEventListener('click', () => deleteTask(index));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });

    updateCounter();
}

// Оновлюємо лічильник завдань
function updateCounter() {
    const total = tasks.length;
    const notDone = tasks.filter(t => !t.done).length;
    counter.textContent = `Усього: ${total} | Не виконано: ${notDone}`;
}

// Додавання нового завдання
function addTask() {
    const text = taskInput.value.trim();

    // Порожнє завдання не додаємо
    if (text === '') {
        alert('Напиши текст завдання!');
        return;
    }

    tasks.push({ text: text, done: false });
    taskInput.value = '';
    saveTasks();
    render();
}

// Позначення завдання виконаним / невиконаним
function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    render();
}

// Видалення завдання
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    render();
}

// Видалення всіх виконаних завдань
function clearDone() {
    tasks = tasks.filter(t => !t.done);
    saveTasks();
    render();
}

// Обробка кнопки "Додати"
addBtn.addEventListener('click', addTask);

// Додавання по натисканню Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Кнопка "Очистити виконані"
clearDoneBtn.addEventListener('click', clearDone);

// Фільтри: всі / активні / виконані
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
    });
});

// Показуємо збережені завдання при завантаженні сторінки
render();
