const searchInput = document.getElementById('searchInput')
let searchTime;
searchInput.addEventListener('keyup', (event) => {
	let value = event.target.value.toLowerCase();
	clearTimeout(searchTime);

	searchTime = setTimeout(() => {
		let tasks = getData().tasks;
		searchResult = tasks.filter(task => task.title.toLowerCase().indexOf(value) !=-1 );
		let data = getData();
		updateCurrentView(true, searchResult, data.settings.hideCompletedTasks);
	}, 1500);
});