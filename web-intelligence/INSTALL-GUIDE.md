# Install on iPad

## Publish with GitHub Pages
1. In the repository, open **Settings → Pages**.
2. Select **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`, then save.
4. Wait for Pages deployment.
5. Verify:
   - `https://YOUR-USERNAME.github.io/REPOSITORY/web-intelligence/SKILL.md`
   - `https://YOUR-USERNAME.github.io/REPOSITORY/web-intelligence/scripts/index.html`

## Add in Google AI Edge Gallery
1. Open Agent Mode and its Skills manager.
2. Choose **Add (+) → Load skill from URL** (labels can vary by app version).
3. Paste the folder URL:
   `https://YOUR-USERNAME.github.io/REPOSITORY/web-intelligence/`
   Do not paste the SKILL.md URL.
4. Approve installation.

## First diagnostic
Ask: "Use Web Intelligence to diagnose its network connection. Test both search and webpage retrieval endpoints and report any errors."

Then test: "Search for the latest Google AI Edge Gallery Agent Skills documentation, open official sources, and cite the URLs."

## iPad compatibility status
- Skill files committed: yes.
- GitHub Pages configuration: not yet verified/enabled.
- iPad URL installation: not tested.
- iOS run_js execution: not tested.
- Search and extraction network access: must be tested on device.

If the app has no URL-import option on your iPad version, do not use Android ADB instructions; that route is Android-specific.