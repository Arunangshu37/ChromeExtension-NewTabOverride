

let quickNoteTextArea = document.getElementById('quickNoteTextArea');
let quickNoteIdRef = document.getElementById('quickNoteIdRef');
let goToNextQuickNoteButton = document.getElementById('goToNextQuickNoteButton');
let goToPreviousQuickNoteButton = document.getElementById('goToPreviousQuickNoteButton');

let quickNoteSaveTime; 
quickNoteTextArea.addEventListener('keyup', (event) => {
	clearTimeout(quickNoteSaveTime);
	quickNoteSaveTime = setTimeout(() => {
		updateToQuickNotes(event.target.value);
	}, 2000)
});

goToNextQuickNoteButton.addEventListener('click', () => {
	let data = getData();
	if((data.settings.quickNoteLatestIndex + 1) == data.quickNotes.length) {
		quickNoteTextArea.value = '';
		goToNextQuickNoteButton.disabled = true;
		return
	}
	if(data.settings.quickNoteLatestIndex >= 0) {
		goToPreviousQuickNoteButton.disabled = false;
	}
	data.settings.quickNoteLatestIndex++;
	quickNoteTextArea.value = data.quickNotes[data.settings.quickNoteLatestIndex];
	setData(data);
});

goToPreviousQuickNoteButton.addEventListener('click', () => {
	let data = getData();
	if((data.settings.quickNoteLatestIndex - 1) == 0) {
		data.settings.quickNoteLatestIndex = 0;
		quickNoteTextArea.value = data.quickNotes[data.settings.quickNoteLatestIndex];
		goToPreviousQuickNoteButton.disabled = true;
		setData(data);
		return;
	}
	if(data.settings.quickNoteLatestIndex <= data.quickNotes.length - 1) {
		goToNextQuickNoteButton.disabled = false;
	}
	data.settings.quickNoteLatestIndex--;
	quickNoteTextArea.value = data.quickNotes[data.settings.quickNoteLatestIndex];
	setData(data);
})

function updateToQuickNotes(value) {
	let data = getData();
	let temp = (data.settings.quickNoteLatestIndex + 1) == data.quickNotes.length
	if(data.quickNotes.length == 0 || temp) {
		data.quickNotes.push(value);
		data.settings.quickNoteLatestIndex = data.quickNotes.length != 0 ? (data.quickNotes.length - 1)  : data.settings.quickNoteLatestIndex;
		localStorage.setItem(dataStoreId, JSON.stringify(data));
		goToNextQuickNoteButton.disabled = false;
		return;
	}
	data.quickNotes[data.settings.quickNoteLatestIndex] = value;
	localStorage.setItem(dataStoreId, JSON.stringify(data));
}


function loadLatestModifiedQuickNote() {
	let data = getData();
	if(data.quickNotes.length == 0) {
		goToNextQuickNoteButton.disabled = true;
		return;
	}
	if(data.settings.quickNoteLatestIndex == 0 ){
		goToPreviousQuickNoteButton.disabled = true;
	}
	let quickNote = data.quickNotes[data.settings.quickNoteLatestIndex];
	quickNoteTextArea.value = quickNote;
}


function setData(data) {
	localStorage.setItem(dataStoreId, JSON.stringify(data));
}
loadLatestModifiedQuickNote();