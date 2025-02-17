const schema = {
	tasks: [],
	quickNotes: [],
	quickLinks: [],
	settings: {
		quickNoteLatestIndex: 0,
		itemsPerPage: 5
	},
};

const defaultTaskSchema = {
	id: 0,
	title: '',
	description: '',
	dueDate: new Date(),
	dueTime: new Date(),
	status: 0
};

const dataStoreId = "praxidike";

let itemsPerPage = 5;
var totalTasksCount = 0;
var [prevIndex, nextIndex] = [0,0]
const info = document.getElementById('info');

const keyNameMap = {
	id: 'Id',
	title: 'Title',
	description: 'Description',
	dueDate: 'Due Time',
	dueTime: 'Due Date',
	status: 'Status'
};

const fieldsToBeDisplayed = [
	'id',
	"title",
	"dueDate",
	"dueTime",
	"status"
]

const statusDetails = {
	0: {
		name: 'New',
		className: 'new'
	},
	1: {
		name: 'Active',
		className: 'active'
	},
	2: {
		name: 'Complete',
		className: 'complete'
	}
}

var isTaskFormModalOpen = false;
var searchResult = [];