(function ($) {
	const _ = Mavo.Plugins;

	_.register("autoload", {
		ready: new Promise(async resolve => {
			// Fetch plugin index
			const response = await fetch(_.url + "/plugins.json");
			const json = await response.json();
			let plugins = json.plugin;

			const ids = new Set();
			for (const plugin of plugins) {
				const { id, selector } = plugin;

				if (!selector) {
					continue;
				}

				if (!_.loaded[id] && !ids.has(id) && $(selector)) {
					ids.add(id);
				}
			}

			plugins = plugins.filter(plugin => ids.has(plugin.id));
			const result = await Promise.allSettled(
				plugins.map(async plugin => {
					// Load plugin
					const filename = `mavo-${plugin.id}.js`;

					// Plugin hosted in a separate repo
					let url = `https://cdn.jsdelivr.net/gh/${plugin.repo}/${filename}`;

					if (!plugin.repo) {
						// Plugin hosted in the mavo-plugins repo
						url = `${_.url}/${plugin.id}/${filename}`;
					}

					return $.include(_.loaded[plugin.id], url).then(() => plugin.id);
				})
			);

			const loaded = result.filter(p => p.status === "fulfilled").map(p => p.value);
			const failed = plugins.filter(p => !loaded.includes(p.id)).map(p => p.id);

			console.log(`Mavo plugins loaded: ${loaded.length ? loaded.join(", ") : "none"}.`);

			if (failed.length) {
				console.log(`Mavo plugins failed to load: ${failed.join(", ")}.`);
			}

			resolve();
		})
	});
})(Bliss);
