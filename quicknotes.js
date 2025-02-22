

let quickNoteTextArea = document.getElementById('quickNoteTextArea');
let quickNoteIdRef = document.getElementById('quickNoteIdRef');
let goToNextQuickNoteButton = document.getElementById('goToNextQuickNoteButton');
let goToPreviousQuickNoteButton = document.getElementById('goToPreviousQuickNoteButton');
let quickNoteDeleteConfirmationModalDeleteButton = document.getElementById('quickNoteDeleteConfirmationModalDeleteButton');

let quickNoteSaveTime;

quickNoteDeleteConfirmationModalDeleteButton.addEventListener('click', () => {
	const quickNoteId = +quickNoteDeleteConfirmationModalDeleteButton.getAttribute('quick-note-index');
	deleteConfirmationButton.setAttribute('quick-note-id', quickNoteId);
	deleteConfirmationModal.show();
});


quickNoteTextArea.addEventListener('keyup', (event) => {
	clearTimeout(quickNoteSaveTime);
	quickNoteSaveTime = setTimeout(() => {
		updateToQuickNotes(event.target.value);
	}, 2000)
});

goToNextQuickNoteButton.addEventListener('click', () => {
	let data = getData();
	if ((data.settings.quickNoteLatestIndex + 1) == data.quickNotes.length) {
		quickNoteTextArea.value = '';
		goToNextQuickNoteButton.disabled = true;
		quickNoteDeleteConfirmationModalDeleteButton.disabled = true;
		if(goToPreviousQuickNoteButton.disabled) {
			goToPreviousQuickNoteButton.disabled = false;
		}
		return
	}
	if (data.settings.quickNoteLatestIndex >= 0) {
		goToPreviousQuickNoteButton.disabled = false;
	}
	data.settings.quickNoteLatestIndex++;
	quickNoteTextArea.value = data.quickNotes[data.settings.quickNoteLatestIndex];
	setQuickNoteData(data);
});

goToPreviousQuickNoteButton.addEventListener('click', () => {
	let data = getData();
	if(data.settings.quickNoteLatestIndex == 0) {
		goToNextQuickNoteButton.disabled = false;
		quickNoteDeleteConfirmationModalDeleteButton.disabled = false;
		goToPreviousQuickNoteButton.disabled = true;
		quickNoteTextArea.value = data.quickNotes[data.settings.quickNoteLatestIndex];
		return;
	} 
	if ((data.settings.quickNoteLatestIndex - 1) == 0) {
		quickNoteDeleteConfirmationModalDeleteButton.disabled = false;
		if(goToNextQuickNoteButton.disabled) {
			// this means i have only 2 element in array [0,1]
			// and i am at the last new page so i do not need to decrement the index here. 
			goToNextQuickNoteButton.disabled = false;
			quickNoteTextArea.value = data.quickNotes[data.settings.quickNoteLatestIndex];
			return;
		}
		data.settings.quickNoteLatestIndex--;
		quickNoteTextArea.value = data.quickNotes[data.settings.quickNoteLatestIndex];
		goToPreviousQuickNoteButton.disabled = true;
		setQuickNoteData(data);
		return;
	}
	quickNoteDeleteConfirmationModalDeleteButton.disabled = false;
	if (data.settings.quickNoteLatestIndex <= data.quickNotes.length - 1) {
		if(goToNextQuickNoteButton.disabled){
			quickNoteTextArea.value = data.quickNotes[data.settings.quickNoteLatestIndex];
			goToNextQuickNoteButton.disabled = false;
			return;
		}
		data.settings.quickNoteLatestIndex--;
	}
	quickNoteTextArea.value = data.quickNotes[data.settings.quickNoteLatestIndex];
	setQuickNoteData(data);
})

function updateToQuickNotes(value) {
	let data = getData();
	let temp = (data.settings.quickNoteLatestIndex + 1) == data.quickNotes.length
	if ((data.quickNotes.length == 0 || temp) && goToNextQuickNoteButton.disabled) {
		data.quickNotes.push(value);
		data.settings.quickNoteLatestIndex = data.quickNotes.length != 0 ? (data.quickNotes.length - 1) : data.settings.quickNoteLatestIndex;
		localStorage.setItem(dataStoreId, JSON.stringify(data));
		goToNextQuickNoteButton.disabled = false;
		return;
	}
	data.quickNotes[data.settings.quickNoteLatestIndex] = value;
	localStorage.setItem(dataStoreId, JSON.stringify(data));
}

function loadLatestModifiedQuickNote() {
	let data = getData();
	if (data.quickNotes.length == 0) {
		goToNextQuickNoteButton.disabled = true;
		quickNoteDeleteConfirmationModalDeleteButton.disabled = true;
			goToPreviousQuickNoteButton.disabled = true;
		return;
	}
	if (data.settings.quickNoteLatestIndex == 0) {
		goToPreviousQuickNoteButton.disabled = true;
	}
	let quickNote = data.quickNotes[data.settings.quickNoteLatestIndex];
	quickNoteTextArea.value = quickNote;
}

function removeQuickNote(index) {
	let data = getData();
	data.quickNotes.splice(index, 1);
	data.settings.quickNoteLatestIndex = (index - 1) < 0 ? 0 : (index - 1);
	quickNoteTextArea.value = data.quickNotes[data.settings.quickNoteLatestIndex];
}


loadLatestModifiedQuickNote();