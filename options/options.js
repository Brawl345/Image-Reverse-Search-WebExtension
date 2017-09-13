/* Localization */
// document.title = chrome.i18n.getMessage('extensionName') + ' | ' + chrome.i18n.getMessage('optionsPageTitle');
// document.getElementById('navbarTitle').textContent = chrome.i18n.getMessage('extensionName');

/* Abbreviation */
// sp / SP: search provider

/* Extension default search providers */

/* provider : {
		abbr: string, // as provider id
		icon: string | base64, // todo
		url: url,
		checked: bool, // from storage
		mode: 'default' | 'edit', // for view state
	}
*/

const spGoogle = {
	abbr: 'google',
	icon: '../icons/google.png',
	url: 'https://www.google.com/searchbyimage?image_url=%s',
	checked: true,
};
const spBing = {
	abbr: 'bing',
	icon: '../icons/bing.png',
	url: 'https://www.bing.com/images/searchbyimage?FORM=IRSBIQ&cbir=sbi&imgurl=%s',
};
const spYandex = {
	abbr: 'yandex',
	icon: '../icons/yandex.png',
	url: 'https://yandex.com/images/search?url=%s&rpt=imageview',
};
const spYandexru = {
	abbr: 'yandexru',
	icon: '../icons/yandexru.png',
	url: 'https://yandex.ru/images/search?url=%s&rpt=imageview',
};
const spTineye = {
	abbr: 'tineye',
	icon: '../icons/tineye.png',
	url: 'https://www.tineye.com/parse?url=%s',
};
const spBaidu = {
	abbr: 'baidu',
	icon: '../icons/baidu.png',
	url: 'https://image.baidu.com/n/pc_search?queryImageUrl=%s',
};
const spSaucenao = {
	abbr: 'saucenao',
	icon: '../icons/saucenao.png',
	url: 'https://saucenao.com/search.php?db=999&url=%s',
};
const spIqdb = {
	abbr: 'iqdb',
	icon: '../icons/iqdb.png',
	url: 'https://iqdb.org/?url=%s',
};

function getDefaultSearchProviders() {
	const DSPs = JSON.parse(
		JSON.stringify([spGoogle, spBing, spYandex, spYandexru, spTineye, spBaidu, spSaucenao, spIqdb]),
	);
	for (let sp of DSPs) {
		sp.checked = sp.checked || false;
		sp.mode = 'default';
	}
	return DSPs;
}

/* View */
const providerTemplate = `
<div class="input-group">
	<span class="sp-check input-group-addon form-check">
		<label class="form-check-label custom-control custom-checkbox">
			<input type="checkbox" class="custom-control-input" v-model="sp.checked"/>
			<span class="custom-control-indicator"></span>
		</label>
	</span>
	<span class="sp-icon input-group-addon">
		<img :src="sp.icon">
	</span>
	<input type="text" class="sp-abbr form-control col-sm-3" pattern="\\w{2,9}"
		v-model="sp.abbr" :class="{'default': sp.mode !== 'edit'}" :placeholder="abbrPlaceholder"
		@click="sp.mode = 'edit'"/>
	<input type="url" class="sp-url form-control" pattern="https?:\/\/.*%s.*"
		v-model="sp.url" :style="urlStyle" :placeholder="urlPlaceholder"/>
	<a class="sp-status curser-ptr input-group-addon" :style="urlStyle" @click="validate">
		<i class="fa fa-check text-success" aria-hidden="true" v-show="valid"></i>
		<i class="fa fa-times text-danger" aria-hidden="true" v-show="!valid"></i>
	</a>
	<a class="sp-remove curser-ptr input-group-addon" @click="$emit('remove')">
		<i class="fa fa-trash" aria-hidden="true"></i>
	</a>

</div>`;

Vue.component('provider', {
	props: ['sp', 'index'],
	data() {
		return {
			abbrPlaceholder: '2 ~ 9 個英文 / 數字',
			urlPlaceholder: '需以 http(s):// 開頭且包含 %s',
		};
	},
	methods: {
		validate() {
			if (!/^\w{2,9}$/.test(this.sp.abbr)) {
				const msg = '第 $index$ 個搜尋引擎的縮寫不符合格式，請使用 $abbrPlaceholder$'
					.replace('$index$', this.index + 1)
					.replace('$abbrPlaceholder$', this.abbrPlaceholder);
				this.$emit('alert', msg);
			}
			if (!/^https?:\/\/.*%s.*$/.test(this.sp.url)) {
				const msg = '第 $index$ 個搜尋引擎的網址不符合格式，請使用 $urlPlaceholder$'
					.replace('$index$', this.index + 1)
					.replace('$urlPlaceholder$', this.urlPlaceholder);
				this.$emit('alert', msg);
			}
			if (this.valid) {
				this.sp.mode = 'default';
			}
			return;
		},
	},
	computed: {
		urlStyle() {
			return {
				display: this.sp.mode !== 'edit' ? 'none' : '',
			};
		},
		valid() {
			return (
				this.sp.abbr && /^\w{2,9}$/.test(this.sp.abbr) && this.sp.url && /^https?:\/\/.*%s.*$/.test(this.sp.url)
			);
		},
	},
	template: providerTemplate,
});

const vm = new Vue({
	el: '#container',
	data: {
		i18n: {
			openInBackgroundLabel: '在背景打開結果',
			openTabAtLabel: '打開搜尋結果',
			openTabAtRight: '當前分頁右側',
			openTabAtLeft: '當前分頁左側',
			openTabAtEnd: '分頁欄最尾端',
			searchProviderLabel: '搜尋引擎',
			addSearchProvider: '新增搜尋引擎',
			saveOptions: '保存選項',
			restoreDefaultSearchProvider: '還原預設引擎',
			atLeastOneSearchProviders: '請至少保留一搜尋引擎',
			existEdittingSearchProviders: '還有編輯中搜尋引擎，請按下 ✓ 完成編輯',
			successSaveOptions: '成功保存！',
		},
		providers: [...getDefaultSearchProviders()],
		errorMessages: [],
		successMessage: '',
	},
	methods: {
		addSearchProvider() {
			this.providers.push({
				abbr: '',
				icon: '../icons/other.png',
				url: '',
				checked: true,
				mode: 'edit',
			});
		},
		removeSearchProvider(index) {
			if (this.providers.length > 1) {
				this.providers.splice(index, 1);
			} else {
				this.validationAlert(this.i18n.atLeastOneSearchProviders);
			}
		},
		restoreDefaultSearchProvider() {
			this.providers = [...getDefaultSearchProviders()];
		},
		validationAlert(msg) {
			this.errorMessages.push(msg);
			setTimeout(() => {
				this.errorMessages.splice(this.errorMessages.indexOf(msg), 1);
			}, 5000);
		},
		validateAll() {
			let selectedSP = 0;
			for (let sp of this.providers) {
				if (sp.mode === 'edit') {
					// Any provider in edit mode, invalid.
					this.validationAlert(this.i18n.existEdittingSearchProviders);
					return false;
				}
				if (sp.checked) {
					selectedSP += 1;
				}
			}
			if (selectedSP < 1) {
				this.validationAlert(this.i18n.atLeastOneSearchProviders);
				return false;
			}
			return true;
		},
		saveOptions() {
			if (this.validateAll()) {
				this.errorMessages = [];
				this.successMessage = this.i18n.successSaveOptions;
				setTimeout(() => {
					this.successMessage = '';
				}, 5000);
			}
		},
	},
});
