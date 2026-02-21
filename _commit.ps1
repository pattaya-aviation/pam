$git = "C:\Users\AllHD-S\AppData\Local\GitHubDesktop\app-3.5.5\resources\app\git\cmd\git.exe"

& $git add -A
Write-Host "Staged all changes"

$msg = @"
refactor: restructure folders and rename files for clarity

Page structure:
- page/userpage/ -> page/home/
- page/adminpage/ -> page/portal/
- page/portal/vfc-admin/ -> page/portal/vfc/
- page/portal/tax-admin/ -> page/portal/tax/

Function structure:
- function/admin/ -> function/portal/
- function/user/ -> function/home/
- function/portal/css/vfc-admin.css -> vfc.css

File renames:
- pa-system.html -> pam.html
- vfc-home.html -> vfc.html
- tax-home.html -> tax.html
- tax-calculator.html -> calculator.html
- pa-ly01.html -> ly01.html

Other:
- Extract vfc-admin inline CSS to function/portal/css/vfc.css
- Fix getBasePath() in navbar.js to detect depth from page/ segment
- Remove dead code: dont-use/, vfc-admin.js
- Update all cross-file path references
- Update README with current project structure
"@

& $git commit -m $msg
