# Workflow

After making code changes, always run lint fix then lint check:

```bash
npx eslint ./src --ext .ts,.tsx --fix
npm run lint
```

This is the default workflow for every change — no exceptions.
