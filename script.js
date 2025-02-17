
function init() {
	console.log("Scripts Loaded");
	let jsonStringFromLocalStorage = localStorage.getItem(dataStoreId);
	if (isAssigned(jsonStringFromLocalStorage) && jsonStringFromLocalStorage != '') {
		let data = JSON.parse(jsonStringFromLocalStorage);
		totalTasksCount = data.tasks.length;
		updateCurrentView();
		return;
	}
	const initialSchema = JSON.stringify(schema);
	localStorage.setItem(dataStoreId, initialSchema);
	return;
}

// CRUD operations
function createTask(formData) {
	// validate
	let isFormValid = true;
	for (let index = 0; index < fields.length; index++) {
		if (!isAssigned(formData[fields[index]])) {
			alert("Incomplete form");
			isFormValid = false;
			break;
		}
	}
	if (!isFormValid) {
		alert('Fill the form with valid data.');
	}
	let dataStore = getData();
	const newId = +(Date.now());
	const dataWithId = { ...formData, id: newId };
	dataStore.tasks.push(dataWithId);
	localStorage.setItem(dataStoreId, JSON.stringify(dataStore));
	taskForm.reset();
	updateCurrentView();
	taskFormModal.hide();
	totalTasksCount = dataStore.tasks.length;
}

function updateTask(data) {
	let dataFromLocalStorage = getData();
	let indexOfItemToBeUpdated = dataFromLocalStorage.tasks.findIndex(item => item.id == data.id);
	dataFromLocalStorage.tasks[indexOfItemToBeUpdated] = data;
	localStorage.setItem(dataStoreId, JSON.stringify(dataFromLocalStorage));
	taskFormModal.hide();
	updateCurrentView(false);
}

function deleteTask(event) {
	let id = event.target.getAttribute('task-id');
	let dataFromLocalStorage = getData();
	let indexOfItemToBeUpdated = dataFromLocalStorage.tasks.findIndex(item => item.id == id);
	dataFromLocalStorage.tasks.splice(indexOfItemToBeUpdated, 1);
	localStorage.setItem(dataStoreId, JSON.stringify(dataFromLocalStorage));
	taskFormModal.hide();
	taskFormModalDeleteConfirmation.hide();
	totalTasksCount = dataFromLocalStorage.tasks.length;
	updateCurrentView(false);
}

function loadData(fieldsToBeDisplayed, data) {
	buildColumnHeadings(fieldsToBeDisplayed);
	data.forEach((item) => {
		addRowToTheEndOfTable(item);
	});
}
// ------ ------ ------ ------ ------ ------ ------ ------

function addRowToTheEndOfTable(item) {
	let tbody = document.getElementById('tbody');
	let tr = document.createElement('tr');
	tr.id = `${item.id}tr`;
	tr.classList.add('item');
	tr.addEventListener('click', handleRowClicked);
	tr.addEventListener('contextmenu', displayContextMenu);
	attachCellDataToTableRow(item, tr);
	tbody.appendChild(tr);
}

function updateCurrentView(reset = true, particularTasks = []) {
	let tasks = particularTasks
	if(particularTasks.length == 0) {
		tasks = getData().tasks;
	}
	tbody.innerHTML = '';
	if(reset) {
		[prevIndex, nextIndex] = [0, +(itemsPerPage <= tasks.length ? itemsPerPage : tasks.length)];
	}
	if(prevIndex == totalTasksCount) {
		nextIndex = prevIndex;
		prevIndex = prevIndex - itemsPerPage >= 0 ? prevIndex - itemsPerPage : 0;
	}
	let tasksToDisplay = tasks.slice(prevIndex, nextIndex);
	loadData(fieldsToBeDisplayed, tasksToDisplay);
}

function attachCellDataToTableRow(item, tr) {
	const keysOfItem = Object.keys(item);

	for (key of fieldsToBeDisplayed) {
		if (keysOfItem.includes(key)) {
			let td = document.createElement('td');
			if (key == 'status') {
				let span = document.createElement('span');
				span.setAttribute('class', `badge ${statusDetails[+item[key]].className}`)
				span.textContent = statusDetails[+item[key]].name;
				td.appendChild(span);
				tr.appendChild(td);
				continue;
			}
			td.textContent = item[key];
			tr.appendChild(td);
		}
	}
}

function getData() {
	const dataStoreJsonString = localStorage.getItem(dataStoreId);
	return JSON.parse(dataStoreJsonString);
}

// Event listeners function when clicked on a row
function handleRowClicked(event) {
	isTaskFormModalOpen = true;
	let { tasks } = getData();
	const id = event.target.parentElement.id;
	const item = tasks.find((item) => item.id == id.substring(0, id.length - 2));
	updateFormAndOpenModal(item);
}

function displayContextMenu(event) {
	event.preventDefault();
	if(rowSelected) {
		rowSelected.style.backgroundColor = '';
	}
	rowSelected = event.target.parentElement;
	rowSelected.style.backgroundColor = 'lightgrey';
	rowContextMenu.style.display = 'block';
	rowContextMenu.style.top = `${event.y}px`;
	rowContextMenu.style.left = `${event.x}px`;

	const id = event.target.parentElement.id;
	const item = getData().tasks.find((item) => item.id == id.substring(0, id.length - 2));

	rowContextMenu.setAttribute('taskData', JSON.stringify(item));
}

function updateFormAndOpenModal(item) {
	const keyOfItems = Object.keys(item);
	Array.from(taskForm.elements).forEach(element => {
		if (keyOfItems.includes(element.name)) {
			element.value = item[element.name];
		}
	})
	taskDeletedConfirmedButton.setAttribute('task-id', item.id);
	taskFormModal.show();
}

function buildColumnHeadings(fieldsToBeDisplayed) {
	let taskTableColumnHeaders = document.getElementById('taskTableColumnHeaders');
	taskTableColumnHeaders.innerHTML = '';
	fieldsToBeDisplayed.forEach((field) => {
		let th = document.createElement('th');
		th.textContent = keyNameMap[field];
		taskTableColumnHeaders.appendChild(th);
	});
}

// utility methods to keep code decoupled.

function isAssigned(value) {
	return !(value == null || value == undefined || value == 'undefined')
}

// initializing scripts and setting up basic requirements to get the app working.
init();