# NPM Publishing Guide

This document is for maintainers who need to publish new versions of `scorm-xapi-wrapper` to npm.

## Pre-Publish Checklist

Before publishing, ensure:

- [ ] All tests pass locally
- [ ] Documentation is up to date (README, QUICKSTART, CURSOR_AI_GUIDE)
- [ ] All template `package.json` files reference correct version
- [ ] CHANGELOG is updated (if you have one)
- [ ] No sensitive data in package
- [ ] `.npmignore` is correct
- [ ] Build is successful (`npm run build`)

## Version Bump

Follow semantic versioning (semver):

- **Patch** (1.0.x): Bug fixes, minor changes
- **Minor** (1.x.0): New features, backwards compatible
- **Major** (x.0.0): Breaking changes

```bash
# Patch version (bug fixes)
npm version patch

# Minor version (new features)
npm version minor

# Major version (breaking changes)
npm version major
```

This will:
1. Update version in `package.json`
2. Create a git tag
3. Commit the version change

## Build the Package

```bash
npm run build
```

Verify the `dist/` directory contains:
- `scorm-wrapper.esm.js`
- `scorm-wrapper.cjs.js`
- `scorm-wrapper.umd.js`
- Corresponding `.map` files

## Test the Package Locally

Create a test package to verify contents:

```bash
npm pack
```

This creates `scorm-xapi-wrapper-x.x.x.tgz`. Extract and verify:

```bash
tar -xzf scorm-xapi-wrapper-*.tgz
cd package
ls -la
```

Check that:
- `dist/` folder is included
- `types/` folder is included
- `templates/` folder is included
- `tools/` folder is included
- `cli.js` is included
- `test-courses/` is **NOT** included
- `examples/` is **NOT** included
- `src/` is **NOT** included

## Test CLI Commands

Test the bin commands work:

```bash
# Install locally
npm install -g ./scorm-xapi-wrapper-*.tgz

# Test create command
create-scorm-course test-course
cd test-course
npm install

# Test packaging commands
npm run build
npx package-scorm -i dist -o test.zip
npx package-xapi -i dist -o test-xapi.zip

# Verify ZIPs were created
ls -lh *.zip

# Clean up
cd ..
rm -rf test-course
npm uninstall -g scorm-xapi-wrapper
```

## Publish to npm

### First Time Setup

If you haven't published before:

```bash
# Login to npm
npm login

# Verify you're logged in
npm whoami
```

### Publish

**Dry run first** (see what would be published):

```bash
npm publish --dry-run
```

Review the output carefully. Then publish for real:

```bash
npm publish
```

For pre-release versions (alpha, beta, rc):

```bash
npm publish --tag beta
```

## Post-Publish

### Verify on npm

1. Visit https://www.npmjs.com/package/scorm-xapi-wrapper
2. Check version number is correct
3. Verify README displays correctly
4. Test installation: `npx create-scorm-course test-verify`

### Push Git Tags

```bash
git push origin main --tags
```

### Create GitHub Release

1. Go to https://github.com/natenorm/scorm-xapi-wrapper/releases
2. Click "Draft a new release"
3. Select the version tag (e.g., `v1.0.0`)
4. Title: `v1.0.0 - Release Name`
5. Description: Summarize changes from CHANGELOG
6. Publish release

### Update Documentation

If needed, update:
- README badges (npm version, downloads)
- Any version-specific documentation
- Migration guides for breaking changes

## Troubleshooting

### "You cannot publish over the previously published version"

You tried to publish the same version twice. Bump the version:

```bash
npm version patch
npm publish
```

### "You do not have permission to publish"

Ensure you're logged in as the correct npm user:

```bash
npm whoami
npm login
```

### Package too large

Check what's being included:

```bash
npm pack --dry-run
```

Update `.npmignore` to exclude unnecessary files.

### Missing files in published package

Check `.npmignore` and `package.json` `files` array. The `files` array takes precedence.

## Rolling Back

If you published a broken version:

```bash
# Deprecate the version (don't use npm unpublish)
npm deprecate scorm-xapi-wrapper@1.0.1 "Broken release, use 1.0.2 instead"

# Then publish a fixed version
npm version patch
npm publish
```

**Note:** Never use `npm unpublish` for public packages unless within 72 hours and no one has downloaded it.

## Maintenance Schedule

Recommended:
- **Security updates**: Immediately
- **Bug fixes**: As needed (patch releases)
- **New features**: Monthly or quarterly (minor releases)
- **Breaking changes**: Rarely, with advance notice (major releases)

## Support

Questions? Open an issue at https://github.com/natenorm/scorm-xapi-wrapper/issues

