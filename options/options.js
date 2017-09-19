/** Utility Functions **/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const $el = document.createElement.bind(document);
function i18nOrdinal(n) {
	const [prefix, suffix] = chrome.i18n.getUILanguage().split('-', 2);
	if (prefix === 'en') {
		if (n == 1) return '1st';
		if (n == 2) return '2nd';
		if (n == 3) return '3rd';
		return `${n}th`;
	}
	return `${n}`;
}

function alertErrorMsgElement(text) {
	const msg = createErrorMsgElement(text);
	$('#alertMessages').appendChild(msg);
	setTimeout(() => {
		msg.remove();
	}, 1800);
}

function createErrorMsgElement(text) {
	const div = $el('div');
	div.classList.add('alert', 'alert-danger', 'col-sm-12');
	div.setAttribute('role', 'alert');
	div.textContent = text;
	return div;
}

function validateSpName(name, index) {
	if (!/^\S{2,9}$/.test(name)) {
		const msg = chrome.i18n.getMessage('providerNamePlaceholderError', i18nOrdinal(index));
		alertErrorMsgElement(msg);
		return false;
	}
	return true;
}

function validateSpUrl(url, index) {
	if (!/^https?:\/\/.*%s.*$/.test(url)) {
		const msg = chrome.i18n.getMessage('providerURLPlaceholderError', i18nOrdinal(index));
		alertErrorMsgElement(msg);
		return false;
	}
	return true;
}

function createSpRemoveElement() {
	// <a class="sp-remove input-group-addon">
	// 	<i class="fa fa-trash" aria-hidden="true"></i>
	// </a>
	const a = $el('a');
	a.classList.add('sp-remove', 'input-group-addon');
	a.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i>`;
	return a;
}

function createSpStatusElement() {
	// <a class="sp-status input-group-addon">
	// 	<i class="fa fa-check text-success" aria-hidden="true"></i>
	// 	<i class="fa fa-times text-danger" aria-hidden="true"></i>
	// </a>
	const a = $el('a');
	a.classList.add('sp-status', 'input-group-addon');
	a.innerHTML = `
	<i class="fa fa-check text-success" aria-hidden="true"></i>
	<i class="fa fa-times text-danger" aria-hidden="true"></i>`;
	return a;
}

function createSpUrlElement(text) {
	const input = $el('input');
	input.type = 'url';
	input.value = text;
	input.classList.add('sp-url', 'form-control');
	input.pattern = 'https?:\\/\\/.*%s.*';
	input.placeholder = chrome.i18n.getMessage('providerURLPlaceholder');
	return input;
}

function createSpNameElement(text) {
	const input = $el('input');
	input.value = text;
	input.classList.add('sp-name', 'form-control', 'col-sm-3', 'sp-edit');
	input.pattern = '\\S{2,9}';
	input.placeholder = chrome.i18n.getMessage('providerNamePlaceholder');
	input.onclick = event => {
		input.classList.add('sp-edit');
	};
	return input;
}

function createSpIconElement(src) {
	// 	<span class="sp-icon input-group-addon">
	// 		<img src=""/>
	// 	</span>
	const span = $el('span');
	span.innerHTML = `<img src="${src}"/>`;
	span.classList.add('sp-icon', 'input-group-addon');
	return span;
}

function createSpCheckboxElement(selected) {
	// 	<span class="sp-selected input-group-addon form-check">
	// 		<label class="form-check-label custom-control custom-checkbox">
	// 			<input class="form-check-input custom-control-input" type="checkbox" />
	// 			<span class="custom-control-indicator" />
	// 		</label>
	// 	</span>
	const span = $el('span');
	span.innerHTML = `
	<label class="form-check-label custom-control custom-checkbox">
		<input class="form-check-input custom-control-input" type="checkbox" ${selected ? 'checked' : ''}/>
		<span class="custom-control-indicator"/>
	</label>`;
	span.classList.add('sp-selected', 'input-group-addon', 'form-check');
	return span;
}

function createSearchProviderElement(name = '', icon = '../icons/other.png', url = '', selected = false, edit = true) {
	const root = $el('div');
	root.classList.add('searchProviderListItem', 'input-group');

	const spName = createSpNameElement(name);
	const spUrl = createSpUrlElement(url);
	const spStatus = createSpStatusElement();
	const spRemove = createSpRemoveElement();

	spStatus.onclick = () => {
		const index = Array.from(root.parentElement.children).indexOf(root) + 1;
		let valid = true;

		if (!validateSpName(spName.value, index)) {
			valid = false;
		}

		if (!validateSpUrl(spUrl.value, index)) {
			valid = false;
		}

		if (valid) {
			spName.classList.remove('sp-edit');
		}
	};

	spRemove.onclick = () => {
		root.remove();
	};

	root.appendChild(createSpCheckboxElement(selected));
	root.appendChild(createSpIconElement(icon));
	root.appendChild(spName);
	root.appendChild(spUrl);
	root.appendChild(spStatus);
	root.appendChild(spRemove);

	if (!edit) {
		spName.classList.remove('sp-edit');
	}

	return root;
}

/** View binding **/

document.title = `${chrome.i18n.getMessage('extensionName')} | ${chrome.i18n.getMessage('optionsPageTitle')}`;

$('#navbarTitle').textContent = chrome.i18n.getMessage('extensionName');
$('#openInBackgroundLabel').textContent = chrome.i18n.getMessage('openInBackgroundLabel');

$('#openTabAtLabel').textContent = chrome.i18n.getMessage('openTabAtLabel');
$('#openTabAtRight').textContent = chrome.i18n.getMessage('openTabAtRight');
$('#openTabAtLeft').textContent = chrome.i18n.getMessage('openTabAtLeft');
$('#openTabAtEnd').textContent = chrome.i18n.getMessage('openTabAtEnd');

/* Search Provider List */
const searchProviderList = $('#searchProviderList');

$('#searchProviderLabel').textContent = chrome.i18n.getMessage('searchProviderLabel');
const addSearchProvider = $('#addSearchProvider');
addSearchProvider.textContent = chrome.i18n.getMessage('addSearchProvider');
addSearchProvider.onclick = () => {
	searchProviderList.appendChild(createSearchProviderElement());
};

/* Restore default */
const restoreDefaultSearchProviders = $('#restoreDefaultSearchProviders');
restoreDefaultSearchProviders.textContent = chrome.i18n.getMessage('restoreDefaultSearchProviders');
restoreDefaultSearchProviders.onclick = () => {
	while (searchProviderList.firstChild) {
		searchProviderList.removeChild(searchProviderList.firstChild);
	}
	for (let p of chrome.extension.getBackgroundPage().getDefaultProvidersClone()) {
		searchProviderList.appendChild(createSearchProviderElement(p.name, p.icon, p.url, p.selected, false));
	}
};

/* Save button */
const saveOptions = $('#saveOptions');
saveOptions.textContent = chrome.i18n.getMessage('saveOptions');
$('.alert-success').textContent = chrome.i18n.getMessage('msgSuccessSaveOptions');

saveOptions.onclick = () => {
	/* Make sure all input valid */
	let selectedCount = 0;
	const nameSet = new Set();
	const storedSettings = {
		openInBackground: $('#openInBackground').checked,
		openTabAt: $('#openTabAt')[$('#openTabAt').selectedIndex].value,
		storageProviders: [],
	};

	for (let li of searchProviderList.children) {
		const index = Array.from(searchProviderList.children).indexOf(li) + 1;
		const selected = li.children[0].firstElementChild.firstElementChild.checked;
		const icon = li.children[1].firstElementChild.src;
		const name = li.children[2].value;
		const url = li.children[3].value;

		if (selected) {
			selectedCount += 1;
		}

		if (!validateSpName(name, index)) {
			return;
		}

		if (!validateSpUrl(url, index)) {
			return;
		}

		if (li.children[2].classList.contains('sp-edit')) {
			alertErrorMsgElement(chrome.i18n.getMessage('msgExistEdittingSearchProviders'));
			return;
		}

		storedSettings.storageProviders.push({ name, url, icon, selected });
		nameSet.add(name);
	}

	if (selectedCount < 1) {
		alertErrorMsgElement(chrome.i18n.getMessage('msgAtLeastOneSearchProvider'));
		return;
	}

	if (nameSet.size < storedSettings.storageProviders.length) {
		alertErrorMsgElement(chrome.i18n.getMessage('msgDuplicatedProviderName'));
		return;
	}

	/* All input valid */
	chrome.contextMenus.removeAll();
	chrome.extension.getBackgroundPage().createContextMenu(storedSettings.storageProviders);
	chrome.storage.sync.set(storedSettings, () => {
		for (let msg of Array.from($$('.alert-danger'))) {
			msg.classList.add('hidden');
		}
		$('.alert-success').classList.remove('hidden');
		setTimeout(() => {
			$('.alert-success').classList.add('hidden');
		}, 1800);
	});
};

function updateUI(storedSettings) {
	const openTabAt = $('#openTabAt');
	openTabAt.selectedIndex = Array.from(openTabAt.options)
		.map(opt => opt.value)
		.indexOf(storedSettings.openTabAt);
	$('#openInBackground').checked = storedSettings.openInBackground;

	for (let p of storedSettings.storageProviders) {
		$('#searchProviderList').appendChild(createSearchProviderElement(p.name, p.icon, p.url, p.selected, false));
	}
}

/* On opening the options page, fetch stored settings and update the UI with them. */
chrome.storage.sync.get(null, updateUI);
