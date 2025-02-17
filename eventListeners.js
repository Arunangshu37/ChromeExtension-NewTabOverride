const taskForm = document.getElementById("taskForm");
const taskFormModal = new bootstrap.Modal('#taskFormModal');
const fields = Object.keys(defaultTaskSchema);
const taskFormModalDeleteButton = document.getElementById('taskFormModalDeleteButton');
const taskDeletedConfirmedButton = document.getElementById('taskDeletedConfirmedButton');
const taskFormModalDeleteConfirmation = new bootstrap.Modal('#taskFormModalDeleteConfirmation');
const openTaskFormModalButton = document.getElementById('openTaskFormModalButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const itemsPerPageInput = document.getElementById('itemsPerPageInput');
const rowContextMenu = document.getElementById('rowContextMenu');
const contextMenuRowDeleteButton = document.getElementById('contextMenuRowDeleteButton');
const closeDeleteConfirmationModalButton = document.getElementById('closeDeleteConfirmationModalButton');

var rowSelected = null;

document.addEventListener('click', (event) => {
	if(rowSelected && event.target.id != rowSelected.id) {
		rowSelected.style.backgroundColor = '';
		rowContextMenu.style.display = 'none';
	}
});

itemsPerPageInput.addEventListener('change', (event) => {
	itemsPerPage = +event.target.value;
	updateCurrentView();
});

// binding event listeners to put life in the app
taskForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const formData = new FormData(taskForm);
	const data = formData.entries().reduce((acc, curr) => {
		if (acc[curr[0]]) {
			return !Array.isArray(acc[curr[0]]) ? { ...acc, [curr[0]]: [acc[curr[0]], curr[1]] } : { ...acc, [curr[0]]: [...acc[curr[0]], curr[1]] }
		}

		return {
			...acc, [curr[0]]: curr[1]
		}
	}, {});
	if (data.id == 0) {
		createTask(data);
		return;
	}
	updateTask(data);
});

taskDeletedConfirmedButton.addEventListener('click', deleteTask);

// to see a clean form whenever the the form is opened on click of create task button
openTaskFormModalButton.addEventListener('click', () => {
	updateFormAndOpenModal(defaultTaskSchema);
});

contextMenuRowDeleteButton.addEventListener('click', (event) => {
	// console.log(event.target.parentElement.parentElement);
	isTaskFormModalOpen = false;
	taskDeletedConfirmedButton.setAttribute('task-id', JSON.parse(event.target.parentElement.parentElement.getAttribute('taskdata')).id);
	taskFormModalDeleteConfirmation.show();
});

closeDeleteConfirmationModalButton.addEventListener('click', () => {
	if(isTaskFormModalOpen) {
		taskFormModal.show();
	} 
});

prevButton.addEventListener('click', () => {
	if(prevIndex == 0) {
		return;
	}
	nextIndex = prevIndex;
	prevIndex = prevIndex - itemsPerPage >= 0 ? prevIndex - itemsPerPage : 0;
	info.textContent = `${prevIndex} - ${nextIndex}`
	updateCurrentView(false, searchResult);
});

nextButton.addEventListener('click', () => {
	if(nextIndex == totalTasksCount) {
		return;
	}
	prevIndex = nextIndex;
	nextIndex = nextIndex + itemsPerPage <= totalTasksCount ? (nextIndex + itemsPerPage) : totalTasksCount;
	info.textContent = `${prevIndex} - ${nextIndex}`
	updateCurrentView(false, searchResult);
});