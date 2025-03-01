let maxAllowedQuickLinks = 6;
let quickLinkHolder = document.getElementById('quick-links-holder');
let addMoreQuickLinksButton = document.getElementById('addMoreQuickLinksButton');
let quickLinkForm = document.getElementById('quickLinkForm');
let quickLinkModal = new bootstrap.Modal('#quickLinksModal');
let quickLinkIndex = document.getElementById('quickLinkIndex');



quickLinkForm.addEventListener('submit', saveQuickLink);


function saveQuickLink(event) {
	event.preventDefault();
	const formData = new FormData(quickLinkForm);
	const quickLink = Array.from(formData).reduce((acc, curr) => {
		return {
			...acc,
			[curr[0]]: curr[1]
		}
	}, {});
	let dataFromLocalStorage = getData();
	if(+quickLinkIndex.value == -1) {
		dataFromLocalStorage.quickLinks.push(quickLink);
	} else {
		const keyOfItem = Object.keys(dataFromLocalStorage.quickLinks[+quickLinkIndex.value]);
		Array.from(quickLinkForm.elements).forEach((element) => {
			if(keyOfItem.includes(element.name)) {
				dataFromLocalStorage.quickLinks[+quickLinkIndex.value][element.name] = element.value;
			}
		});
		console.log(dataFromLocalStorage.quickLinks[+quickLinkIndex.value]);
	}
	localStorage.setItem(dataStoreId, JSON.stringify(dataFromLocalStorage));
	quickLinkForm.reset();
	quickLinkModal.hide();
	quickLinkIndex.value = '-1';
	loadQuickLinks();
}

function deleteQuickLink() {

}

function loadQuickLinks() {
	const { quickLinks } = getData();
	quickLinkHolder.innerHTML = '';
	quickLinks.forEach((quickLink, index) => {
		const div = document.createElement('div');
		div.classList.add('quick-link');

		const anchorElement = document.createElement('a');
		anchorElement.href = quickLink.link;
		anchorElement.target = '_blank';
		const img = document.createElement('img');
		img.src = `${quickLink.link}/favicon.ico`;
		const actionButton = document.createElement('button');
		// actionButton.addEventListener('click', openQuickLinkEditForm);
		actionButton.setAttribute('data-bs-toggle', 'popover');
		actionButton.setAttribute('data-bs-placement', 'top');


		const html = `
			<div>
				<a id='quick-link-edit-${index}' role='button' class='btn btn-light'>Edit</a>
				<a id='quick-link-delete-${index}' class='btn btn-light'>Delete</a>
			</div>
		`;
		actionButton.setAttribute('data-bs-content', html);

		const actionIcon = document.createElement('i');;
		actionIcon.setAttribute('class', 'bi bi-three-dots-vertical')
		actionButton.appendChild(actionIcon)
		actionButton.setAttribute('class', 'btn btn-light');

		const label = document.createElement('label');
		label.textContent = quickLink.name;
		label.setAttribute('title', quickLink.name);

		anchorElement.appendChild(img);
		div.appendChild(actionButton);

		div.appendChild(anchorElement);
		div.appendChild(label);
		quickLinkHolder.appendChild(div);

	});

	if (quickLinks.length < 6) {
		let createQuickLinkBtn = document.createElement('button');
		createQuickLinkBtn.id = 'addMoreQuickLinksButton';
		createQuickLinkBtn.setAttribute('class', 'btn btn-light');
		const addIcon = document.createElement('i');
		addIcon.setAttribute('class', 'bi bi-plus-circle');
		createQuickLinkBtn.setAttribute('data-bs-toggle', 'modal');
		createQuickLinkBtn.setAttribute('data-bs-target', '#quickLinksModal');

		createQuickLinkBtn.appendChild(addIcon);
		quickLinkHolder.appendChild(createQuickLinkBtn);
	}
	const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
	const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl, {
		html: true,
		trigger: 'focus'
	}));
}


loadQuickLinks();


function openQuickLinkEditForm(event) {
	const id = +event.target.id.split('-')[2];
	console.log(id)
}


document.addEventListener('click', (event) => {
	if ((event.target.id != undefined || event.target.id !=null)  && event.target.id.indexOf('quick-link-edit') != -1) {
		const id = +event.target.id.split('-')[3];
		quickLinkModal.show();
		const { quickLinks } = getData();
		const keyOfItems = Object.keys(quickLinks[id]);
		Array.from(quickLinkForm.elements).forEach(element => {
			if (keyOfItems.includes(element.name)) {
				element.value = quickLinks[id][element.name];
			} else if(element.name == 'id') {
				element.value = id;
			}
		});
	}
	if (event.target.id.indexOf('quick-link-delete') != -1) {
		const id = +event.target.id.split('-')[3];
		deleteConfirmationModal.show();
		deleteConfirmationButton.setAttribute('quick-link-id', id);
	}
})