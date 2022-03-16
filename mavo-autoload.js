(function ($) {
	const _ = Mavo.Plugins;

	_.register("autoload", {
		ready: new Promise(async resolve => {
			// Fetch plugin index
			const response = await fetch(_.url + "/plugins.json");
			const json = await response.json();
			const plugins = json.plugin;

			// Build plugin register
			const ids = new Set();

			for (const plugin of plugins) {
				const { id, selector } = plugin;

				if (!selector) {
					continue;
				}

				if (!ids.has(id) && $(selector)) {
					ids.add(id);
				}
			}

			resolve(
				Mavo.thenAll(
					plugins
						.filter(plugin => ids.has(plugin.id))
						.map(async plugin => {
							if (_.loaded[plugin.id]) {
								return Promise.resolve();
							}

							// Load plugin
							const filename = `mavo-${plugin.id}.js`;

							// Plugin hosted in a separate repo
							let url = `https://cdn.jsdelivr.net/gh/${plugin.repo}/${filename}`;

							if (!plugin.repo) {
								// Plugin hosted in the mavo-plugins repo
								url = `${_.url}/${plugin.id}/${filename}`;
							}

							return $.include(_.loaded[plugin.id], url);
						})
				)
			);
		})
	});
})(Bliss);
