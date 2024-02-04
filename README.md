# commitlint-plugin-spend

[Commitlint](https://commitlint.js.org/) plugin to enforce the use of [spend directives](https://docs.gitlab.com/ee/user/project/quick_actions.html#issues-merge-requests-and-epics) in commit messages.

## Available rules

### spend

- **condition**: `body` ends with a valid [spend directive](https://docs.gitlab.com/ee/user/project/quick_actions.html#issues-merge-requests-and-epics)
- **rule**: `always`

## Usage

1. Install the plugin:

```bash
npm i -D commitlint-plugin-spend
```

```bash
yarn add -D commitlint-plugin-spend
```

```bash
pnpm add -D commitlint-plugin-spend
```

```bash
bun add -d commitlint-plugin-spend
```

2. Add the plugin to your `commitlint` configuration:

```json
{
  "extends": ["@commitlint/config-conventional"],
  "plugins": ["commitlint-plugin-spend"]
}
```

3. Configure the `spend` rule in your `commitlint` configuration:

```json
{
  "rules": {
    "spend": [2, "always"]
  }
}
```

## License

[MIT](./LICENSE)