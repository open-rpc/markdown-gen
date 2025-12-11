// scripts/fix-workspace-protocol.ts
// Replaces workspace:* protocol with actual versions before npm publish
// since changesets + bun doesn't handle this automatically

const ROOT = process.cwd();

async function getWorkspaceVersions(): Promise<Map<string, string>> {
  const versions = new Map<string, string>();
  const packageJsons = new Bun.Glob("packages/*/package.json").scanSync(ROOT);

  for (const pkgPath of packageJsons) {
    const pkg = await Bun.file(pkgPath).json();
    if (pkg.name && pkg.version) {
      versions.set(pkg.name, pkg.version);
    }
  }
  return versions;
}

async function fixWorkspaceProtocol() {
  const versions = await getWorkspaceVersions();
  const packageJsons = new Bun.Glob("packages/*/package.json").scanSync(ROOT);

  for (const pkgPath of packageJsons) {
    const pkg = await Bun.file(pkgPath).json();
    let modified = false;

    for (const depType of [
      "dependencies",
      "devDependencies",
      "peerDependencies",
    ] as const) {
      const deps = pkg[depType];
      if (!deps) continue;

      for (const [name, version] of Object.entries(deps)) {
        if (typeof version === "string" && version.startsWith("workspace:")) {
          const actualVersion = versions.get(name);
          if (!actualVersion) {
            console.error(`Could not find version for ${name}`);
            process.exit(1);
          }

          // workspace:* → exact, workspace:^ → caret, workspace:~ → tilde
          if (version === "workspace:*") {
            deps[name] = actualVersion;
          } else if (version === "workspace:^") {
            deps[name] = `^${actualVersion}`;
          } else if (version === "workspace:~") {
            deps[name] = `~${actualVersion}`;
          }

          console.log(`${pkgPath}: ${name} ${version} → ${deps[name]}`);
          modified = true;
        }
      }
    }

    if (modified) {
      await Bun.write(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    }
  }
}

fixWorkspaceProtocol();


