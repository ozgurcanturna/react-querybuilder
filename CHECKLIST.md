## Checklist for publishing

1. Update [CHANGELOG.md](CHANGELOG.md) with changes per [Keep a Changelog format](https://keepachangelog.com/)
2. Update documentation in [`react-querybuilder.github.io` repo](https://github.com/react-querybuilder/react-querybuilder.github.io)
3. Run `yarn lerna version [major|minor|patch|prerelease] --no-push` (this automatically runs the `version` script in [`./package.json`](package.json) before committing and tagging)
4. Check that all the `dependencies` have the new version number
5. Run `yarn lerna publish from-git` (with `--dist-tag next` if version is `prerelease`)
