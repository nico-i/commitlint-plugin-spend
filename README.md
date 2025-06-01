# commitlint-plugin-spend

[Commitlint](https://commitlint.js.org/) plugin to enforce the use of [spend directives](https://docs.gitlab.com/ee/user/project/quick_actions.html#issues-merge-requests-and-epics) in commit messages.

Note: Purposefully does not support ISO date suffixes or negative time values, since they do now make sense in the context of a commit message.

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

## Examples

### Valid commit messages

```text
feat: implement user authentication

/spend 2h 30m
```

```text
fix: resolve database connection timeout

/spend_time 1d 3h 15m
```
```

```text
refactor: optimize API response handling

/spend 1mo 2w 3d 4h 5m
```

### Invalid commit messages

```text
feat: implement user authentication

/spend
```

*Error: Spend directive must contain at least one time value*

```text
fix: resolve database connection timeout

/spend 25h 70m
```

*Error: The time value "25h" exceeds the maximum value for "h" (max value: 23)*

```text
refactor: optimize API response handling

/spend 30m 2h 1d
```

*Error: Time values are not in the correct order. Time values must be ordered from largest to smallest unit*

## License

[MIT](./LICENSE)