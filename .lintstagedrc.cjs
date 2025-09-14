module.exports = {
  '**/*.ts': () => 'npm run typecheck',
  '*.{ts,js}': ['npm run lint', 'npm run format'],
  '*.json': ['prettier --write'],
};
