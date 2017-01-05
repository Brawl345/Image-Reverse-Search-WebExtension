// Saves options
function save_options() {
  var open_in_bg = document.getElementById('open_in_bg').checked;
  chrome.storage.local.set({
    open_in_bg: open_in_bg
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in browser/chrome.storage.
function restore_options() {
  // Use default if not set
  chrome.storage.local.get({
    open_in_bg: false
  }, function(items) {
    document.getElementById('open_in_bg').checked = items.open_in_bg;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);