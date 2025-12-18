import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { tmpdir } from "os";
import path from "path";
import fs from "fs/promises";

const CLI_PATH = path.join(import.meta.dir, "cli.ts");
const FIXTURE_PATH = path.join(
  import.meta.dir,
  "fixtures/comprehensive-test-openrpc.json",
);

describe("CLI", () => {
  let tempDir: string;

  beforeAll(async () => {
    tempDir = await fs.mkdtemp(path.join(tmpdir(), "openrpc-md-test-"));
  });

  afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("should show help with -h flag", async () => {
    const proc = Bun.spawn(["bun", CLI_PATH, "-h"], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(stdout).toContain("Usage: openrpc-md");
    expect(stdout).toContain("--methodDir");
    expect(stdout).toContain("--custom");
  });

  it("should show help with --help flag", async () => {
    const proc = Bun.spawn(["bun", CLI_PATH, "--help"], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(stdout).toContain("Usage: openrpc-md");
  });

  it("should error when no document path is provided", async () => {
    const proc = Bun.spawn(["bun", CLI_PATH], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const stderr = await new Response(proc.stderr).text();
    await proc.exited;

    expect(proc.exitCode).toBe(1);
    expect(stderr).toContain("Error: OpenRPC document path is required");
  });

  it("should generate .mdx files by default", async () => {
    const outputDir = path.join(tempDir, "mdx-output");
    await fs.mkdir(outputDir, { recursive: true });

    const proc = Bun.spawn(["bun", CLI_PATH, FIXTURE_PATH, "-m", outputDir], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(stdout).toContain("Generated markdown files");

    // Check that files were created
    const files = await fs.readdir(outputDir);
    expect(files).toContain("index.md");
    expect(files).toContain("test_allOf_composition_param.mdx");
    expect(files).toContain("test_if_then_else_keyword.mdx");
  });

  it("should generate .md files with -t md flag", async () => {
    const outputDir = path.join(tempDir, "md-output");
    await fs.mkdir(outputDir, { recursive: true });

    const proc = Bun.spawn(
      ["bun", CLI_PATH, FIXTURE_PATH, "-m", outputDir, "-t", "md"],
      {
        stdout: "pipe",
        stderr: "pipe",
      },
    );

    await proc.exited;

    expect(proc.exitCode).toBe(0);

    // Check that .md files were created
    const files = await fs.readdir(outputDir);
    expect(files).toContain("index.md");
    expect(files).toContain("test_allOf_composition_param.md");
    expect(files).toContain("test_if_then_else_keyword.md");
    // Should NOT have .mdx files
    expect(files.some((f) => f.endsWith(".mdx"))).toBe(false);
  });

  it("should use --methodDir for output directory", async () => {
    const outputDir = path.join(tempDir, "method-dir-output");
    await fs.mkdir(outputDir, { recursive: true });

    const proc = Bun.spawn(
      ["bun", CLI_PATH, FIXTURE_PATH, "--methodDir", outputDir],
      {
        stdout: "pipe",
        stderr: "pipe",
      },
    );

    const stdout = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(stdout).toContain(outputDir);

    // Verify files exist in the output directory
    const files = await fs.readdir(outputDir);
    expect(files.length).toBeGreaterThan(0);
  });

  it("should generate correct number of method files", async () => {
    const outputDir = path.join(tempDir, "count-output");
    await fs.mkdir(outputDir, { recursive: true });

    const proc = Bun.spawn(["bun", CLI_PATH, FIXTURE_PATH, "-m", outputDir], {
      stdout: "pipe",
      stderr: "pipe",
    });

    await proc.exited;

    expect(proc.exitCode).toBe(0);

    const files = await fs.readdir(outputDir);
    // 26 method files + 1 index.md = 27 total
    expect(files.length).toBe(27);
  });

  it("should generate valid markdown content", async () => {
    const outputDir = path.join(tempDir, "content-output");
    await fs.mkdir(outputDir, { recursive: true });

    const proc = Bun.spawn(["bun", CLI_PATH, FIXTURE_PATH, "-m", outputDir], {
      stdout: "pipe",
      stderr: "pipe",
    });

    await proc.exited;

    expect(proc.exitCode).toBe(0);

    // Read one of the generated files and verify content
    const methodFile = await fs.readFile(
      path.join(outputDir, "test_allOf_composition_param.mdx"),
      "utf8",
    );

    expect(methodFile).toContain("---");
    expect(methodFile).toContain('title: "test_allOf_composition_param"');
    expect(methodFile).toContain("Parameters");
  });

  it("should error on non-existent document path", async () => {
    const proc = Bun.spawn(["bun", CLI_PATH, "/non/existent/path.json"], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const stderr = await new Response(proc.stderr).text();
    await proc.exited;

    expect(proc.exitCode).toBe(1);
    expect(stderr).toContain("Error:");
  });
});
