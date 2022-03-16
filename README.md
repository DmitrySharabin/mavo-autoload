# Autoload

Have you ever faced the issue when you tried to use a backend plugin (or any other), e.g., [Firebase Firestore](https://plugins.mavo.io/plugin/firebase-firestore) or [Google Sheets](https://plugins.mavo.io/plugin/gsheets), and it didn't work? And you couldn't figure out why. Mavo simply didn't want to load your data (or perform some transformations). And then all of a sudden, it hit you that you forgot to include the corresponding plugin via `mv-plugins`. 🤦‍♂️ I've been there so I feel you!

From this moment on, let Mavo load _all the needed plugins_ for you. The only thing you need to do is to add `mv-plugins="autoload"` to the root of your app, and you are done!

**Note:** If for some reason a plugin wasn't downloaded automatically, you still can include it _the old way_: by adding its `id` (e.g., `twitter`) to the `mv-plugins` attribute. Like so: `mv-plugins="autoload twitter"`.
