function submitPostForm(action, fieldName, fieldValue, contentType) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = action;

  if (contentType && contentType !== 'application/x-www-form-urlencoded') {
    form.enctype = contentType;
  }

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = fieldName;
  input.value = fieldValue;

  form.appendChild(input);
  document.body.appendChild(form);

  form.submit();
}

window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SUBMIT_POST_FORM') {
    const { action, fieldName, fieldValue, contentType } = event.data;
    submitPostForm(action, fieldName, fieldValue, contentType);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const loadingText = document.getElementById('loading-text');
  if (loadingText && chrome.i18n) {
    const translatedText = chrome.i18n.getMessage('redirectingToSearchEngine');
    if (translatedText) {
      loadingText.textContent = translatedText;
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (
    urlParams.has('action') &&
    urlParams.has('fieldName') &&
    urlParams.has('fieldValue')
  ) {
    const action = decodeURIComponent(urlParams.get('action'));
    const fieldName = decodeURIComponent(urlParams.get('fieldName'));
    const fieldValue = decodeURIComponent(urlParams.get('fieldValue'));
    const contentType = urlParams.get('contentType')
      ? decodeURIComponent(urlParams.get('contentType'))
      : 'application/x-www-form-urlencoded';

    submitPostForm(action, fieldName, fieldValue, contentType);
  }
});
