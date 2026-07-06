I added a GitHub Actions workflow that builds a Windows executable for this Tauri app and uploads the produced bundle as a workflow artifact.

How to use:
- Save the workflow at: .github/workflows/build-windows.yml on a commit/branch.
- Trigger: run manually via Actions -> Build Windows executable -> Run workflow, or push to main (the workflow also triggers on push to main).
- After a successful run, download the artifact named `tauri-windows-bundle` from the run summary; it contains the .exe/.msi/zip produced by Tauri under src-tauri/target/release/bundle/.

Notes and next steps:
- Code signing requires a signing certificate and extra steps; tell me if you need that.
- For macOS/dmg or Linux AppImage builds, I can add more jobs.
- If the build fails on Actions, send me the run link and I'll inspect logs and propose fixes.
