# Task Tracker (From Scratch)

This is a dead-simple starter you can run locally and deploy fast.

## Run locally
1. Open the `index.html` file in your browser (double-click), **or** use VS Code's **Live Server** extension.
2. Add tasks, edit, complete, delete. Data persists in your browser via `localStorage`.

## Deploy to GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit: task tracker"
git branch -M main
# create a new empty repo on GitHub named task-tracker (no README)
git remote add origin https://github.com/<your-username>/task-tracker.git
git push -u origin main
```
Then in the GitHub repo: **Settings → Pages → Branch: main (/root)** → Save.  
Your site will publish at `https://<your-username>.github.io/task-tracker/`.

## Next steps
- Rename tasks → jobs (client, date, amount, paid?)
- Add search by client and filters
- Move to a real backend (Node/Express + SQLite/Postgres) when ready.
