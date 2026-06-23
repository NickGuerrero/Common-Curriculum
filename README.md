# Common Curriculum

Canvas LMS course management for CST349 (Professional Seminar) and CST395 (AI-Native Solution Engineering).

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your Canvas API token to .env
```

## Architecture Overview

This repository uses a **CSV-first workflow** for assignment management:

```
config/*.csv (Source of Truth)
       ↓
  generate-config
       ↓
config/*-config.js (Generated)
       ↓
  create/update assignments
       ↓
Canvas LMS (Remote)
       ↓
  fetch-assignments
       ↓
config/*.csv (Canvas IDs written back)
```

## Workflow Documentation

### How to Add a New Assignment

1. **Edit the CSV file** (`config/cst349-assignments.csv` or `config/cst395-assignments.csv`):
   ```csv
   key,title,dueDate,type,canvasType,quizType,assignmentGroup,points,sprint,week,htmlFile
   s2-new-assignment,S2: New Assignment,2026-02-15,assignment,assignment,,Sprint 2: Development,10,2,5,assignments/s2-w5-new-assignment.html
   ```

2. **Create the HTML file** in `assignments/` directory:
   ```bash
   # Copy a similar assignment as a template
   cp assignments/s1-w1-example.html assignments/s2-w5-new-assignment.html
   ```

3. **Add the `data-assignment-key` attribute** to the HTML file:
   ```html
   <body data-assignment-key="s2-new-assignment">
   ```

4. **Run the GitHub Actions workflow** or run locally:
   ```bash
   # Generate config from CSV
   node scripts/canvas-sync.js --action=generate-config --course=cst349

   # Create assignment in Canvas (dry-run first)
   npm run canvas:create

   # Apply creation
   npm run canvas:create:apply
   ```

5. **Commit the changes** - the workflow will sync Canvas IDs back to the CSV.

### How to Update Due Dates

1. **Edit the CSV file** - update the `dueDate` column for the relevant assignment(s).

2. **Run the update workflow**:
   ```bash
   # Preview changes (dry-run)
   npm run canvas:update

   # Apply changes to Canvas
   npm run canvas:update:apply
   ```

3. **Commit the CSV changes**.

### How to Add Quiz Questions

Quiz questions are defined in the HTML assignment files using special `<div>` elements:

1. **Edit the HTML file** for the quiz assignment.

2. **Add question markup**:
   ```html
   <div class="quiz-question" data-type="multiple_choice" data-points="2">
     <p class="question-text">What is the capital of France?</p>
     <ul class="answers">
       <li data-correct="true">Paris</li>
       <li>London</li>
       <li>Berlin</li>
       <li>Madrid</li>
     </ul>
   </div>
   ```

3. **Run the quiz creation/update workflow** via GitHub Actions.

### How to Update Weekly Loom Recordings

Loom video URLs are stored in the `weeklyContent` section of the config files:

1. **Edit the config file** (`config/cst349-config.js` or `config/cst395-config.js`) directly for Loom URLs since they are not part of the CSV workflow.

2. **Update the `weeklyContent` section**:
   ```javascript
   weeklyContent: {
     1: {
       loom: "https://www.loom.com/share/YOUR_VIDEO_ID",
       title: "Week 1: Introduction"
     },
     // ...
   }
   ```

3. **Commit and push** - GitHub Pages will serve the updated config.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run canvas:sync` | Fetch Canvas IDs for both courses |
| `npm run canvas:sync:349` | Fetch Canvas IDs for CST349 only |
| `npm run canvas:sync:395` | Fetch Canvas IDs for CST395 only |
| `npm run canvas:validate` | Validate config against Canvas |
| `npm run canvas:courses` | List available Canvas courses |
| `npm run canvas:rename` | Preview assignment renames |
| `npm run canvas:rename:apply` | Apply assignment renames |
| `npm run canvas:create` | Preview assignment creation |
| `npm run canvas:create:apply` | Create assignments in Canvas |
| `npm run canvas:update` | Preview assignment updates |
| `npm run canvas:update:apply` | Update assignments in Canvas |

### Direct Script Actions

```bash
# Generate config.js from CSV (local only)
node scripts/canvas-sync.js --action=generate-config --course=cst349

# Write Canvas IDs back to CSV (local only)
node scripts/canvas-sync.js --action=writeback-csv --course=cst349

# Update HTML files with Canvas links (local only)
node scripts/canvas-sync.js --action=update-html-links --course=cst349

# Full sync pipeline (requires Canvas API)
node scripts/canvas-sync.js --action=full-sync --course=cst349
```

## File Structure

```
Common-Curriculum/
├── .github/
│   └── workflows/
│       └── canvas-sync.yml    # GitHub Actions workflow
├── assignments/               # HTML assignment files
│   ├── s1-w1-*.html
│   └── ...
├── config/
│   ├── cst349-assignments.csv # Source of truth for CST349
│   ├── cst395-assignments.csv # Source of truth for CST395
│   ├── cst349-config.js       # Generated config (do not edit)
│   └── cst395-config.js       # Generated config (do not edit)
├── scripts/
│   ├── canvas-sync.js         # Main sync script
│   └── sync-csv-to-config.js  # CSV to config generator
└── package.json
```

## Environment Variables

Create a `.env` file with:

```bash
CANVAS_API_TOKEN=your_canvas_api_token_here
```

Get your Canvas API token from: Canvas → Account → Settings → Approved Integrations → New Access Token

### Canvas LTI Progress Homepage

The De Anza hosted homepage progress feature uses Netlify Functions plus a Canvas LTI 1.3 launch. The static GitHub Pages homepage remains public output; learner progress is fetched only after Canvas launches the tool and the launch is validated.

Configure the Netlify site with:

```bash
CANVAS_API_BASE_URL=https://cti-courses.instructure.com
CANVAS_API_TOKEN=server_side_canvas_token
LTI_CLIENT_ID=canvas_developer_key_client_id
LTI_REDIRECT_URI=https://canvas-progress-lti.netlify.app/.netlify/functions/canvas-lti-launch
LTI_STATE_SECRET=random_long_secret
PROGRESS_JWT_SECRET=random_long_secret
PROGRESS_ALLOWED_ORIGINS=https://profsathya.github.io
LTI_ALLOWED_TARGET_ORIGINS=https://profsathya.github.io
```

Optional variables:

```bash
CANVAS_JWKS_URL=https://sso.canvaslms.com/api/lti/security/jwks
LTI_ISSUER=https://canvas.instructure.com
LTI_DEPLOYMENT_ID=canvas_deployment_id
LTI_ALLOWED_CLIENT_IDS=canvas_developer_key_client_id,second_client_id
LTI_ALLOWED_DEPLOYMENT_IDS=canvas_deployment_id,second_deployment_id
PROGRESS_ALLOWED_COURSE_IDS=180,183
PROGRESS_TOKEN_TTL_SECONDS=600
LTI_DEFAULT_TARGET_LINK_URI=https://profsathya.github.io/Common-Curriculum/deanza/course1/home.html
```

For one Canvas install, `LTI_CLIENT_ID` and `LTI_DEPLOYMENT_ID` are enough. For multiple Canvas courses or tool installs, keep those single-value variables if desired and add the comma-separated allowlists above. When `PROGRESS_ALLOWED_COURSE_IDS` is set, both the LTI launch and progress endpoint reject courses outside the allowlist before fetching Canvas progress.

For Instructure-hosted Canvas, `LTI_ISSUER` is the Canvas platform issuer, not the
school-specific Canvas URL. Production launches use `https://canvas.instructure.com`.

Canvas custom LTI parameters required by the progress launch:

```text
canvas_course_id=$Canvas.course.id
canvas_user_id=$Canvas.user.id
```

Use these function URLs in the Canvas LTI developer key:

```text
OIDC login/initiate URL: https://canvas-progress-lti.netlify.app/.netlify/functions/canvas-lti-login
Redirect URL: https://canvas-progress-lti.netlify.app/.netlify/functions/canvas-lti-launch
Target link URI: https://profsathya.github.io/Common-Curriculum/deanza/<course>/home.html
```

## GitHub Actions

The repository includes a GitHub Actions workflow for automated Canvas synchronization. Trigger it manually from the Actions tab with the desired action and course.

## Notes

- **Config files are generated**: The `config/*-config.js` files are auto-generated from CSV files. Edit the CSV files, not the config files directly (except for `weeklyContent` Loom URLs).
- **Config files are tracked in git**: Although generated, these files must be committed so GitHub Pages can serve them.
- **HTML files use `data-assignment-key`**: This attribute links HTML files to their CSV/config entries.
