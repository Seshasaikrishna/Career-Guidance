// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('new-task').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    
    if (taskText === "") {
        alert("Task cannot be empty");
        return;
    }

    const task = {
        description: taskText,
        completed: false
    };

    db.collection("tasks").add(task).then(docRef => {
        console.log("Task added with ID: ", docRef.id);
        taskInput.value = '';
        loadTasks();
    }).catch(error => {
        console.error("Error adding task: ", error);
    });
}

function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    db.collection("tasks").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const task = doc.data();
            task.id = doc.id;
            displayTask(task);
        });
    });
}

function displayTask(task) {
    const taskList = document.getElementById('task-list');

    const li = document.createElement('li');
    li.classList.add(task.completed ? 'completed' : '');

    const taskDescription = document.createElement('span');
    taskDescription.textContent = task.description;

    const completeButton = document.createElement('button');
    completeButton.textContent = task.completed ? 'Uncomplete' : 'Complete';
    completeButton.addEventListener('click', () => {
        db.collection("tasks").doc(task.id).update({ completed: !task.completed }).then(() => {
            loadTasks();
        });
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        db.collection("tasks").doc(task.id).delete().then(() => {
            loadTasks();
        });
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        const newDescription = prompt("Edit task description:", task.description);
        if (newDescription !== null) {
            db.collection("tasks").doc(task.id).update({ description: newDescription }).then(() => {
                loadTasks();
            });
        }
    });

    li.appendChild(taskDescription);
    li.appendChild(completeButton);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
}

window.onload = loadTasks;
