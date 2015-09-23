(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var formRootUrl = document.getElementById('root_url');
		var formOauthToken = document.getElementById('oauth_token');
		var formUseParticipating = document.getElementById('use_participating');
		var ghSettingsUrl = document.getElementById('gh_link');

		function loadSettings() {
			GitHubNotify.settings.get(['rootUrl', 'oauthToken', 'useParticipatingCount'], function(items) {
				formRootUrl.value = items.rootUrl;
				formOauthToken.value = items.oauthToken;
				formUseParticipating.checked = items.useParticipatingCount;
			});
		}

		loadSettings();

		function updateBadge() {
			chrome.runtime.sendMessage('update');
		}

		function normalizeRoot(url) {
			if (!/^https?:\/\//.test(url)) {
				// assume it is https
				url = 'https://' + url;
			}
			if (!/\/$/.test(url)) {
				url += '/';
			}
			return url;
		}

		formRootUrl.addEventListener('change', function () {
			var url = normalizeRoot(formRootUrl.value);
			var urlSettings = normalizeRoot(formRootUrl.value) + 'settings/tokens/new?scopes=notifications';
			// case of url is empty: set to default
			if (url === normalizeRoot('')) {
				GitHubNotify.settings.remove('rootUrl');
				GitHubNotify.settings.get('rootUrl', function(items) {
					url = items.rootUrl;
				});
			}
			GitHubNotify.settings.set({rootUrl: url});
			ghSettingsUrl.href = urlSettings;
			updateBadge();
			loadSettings();
		});

		formOauthToken.addEventListener('change', function () {
			var token = formOauthToken.value;
			GitHubNotify.settings.set({oauthToken: token});
			updateBadge();
		});

		formUseParticipating.addEventListener('change', function () {
			GitHubNotify.settings.set({useParticipatingCount: formUseParticipating.checked});
			updateBadge();
		});
	});
})();
