# RCG Composure Audit Quiz — Webflow Embed

A self-contained negotiation assessment quiz built for Red Centre Global (RCG), designed to be embedded into any **Webflow** site as a custom code component. The quiz launches as a full-screen modal overlay triggered by any element on the page.

---

## 📁 Project Files

| File | Description |
|---|---|
| `rcg-quiz.css` | All component styles, scoped under `#rcg-quiz-app-modal` to avoid conflicts with your Webflow site |
| `rcg-quiz.js` | All quiz logic, UI rendering, scoring engine, webhook & email integration |

---

## 🧠 How It Works

The quiz walks users through a 7-scenario negotiation assessment:

1. **Intro** — Collects user name & email
2. **Context** — User selects their professional context (Real Estate / Business Leader)
3. **Calibration** — Collects professional role and annual transaction volume (GDV slider)
4. **7 Scenarios** — Multiple-choice negotiation scenarios scored 1–3 per question
5. **Loading** — Animated analysis screen while webhook/email calls complete
6. **Results** — Competency breakdown bars, estimated financial impact, and CTA to book training

### Scoring

- Total possible score: 7–21 points
- Scaled to a 0–5.0 display score
- Three competency categories tracked:
  - `Trust Deficit`
  - `Influence Without Authority`
  - `Pressure-Induced Errors`
- Profiles: **High Risk** · **Developing** · **Advanced** · **Elite**

---

## 🔌 Webflow Integration

### Step 1 — Host the Assets

Upload both files to a CDN or static host (e.g. GitHub Pages, Cloudflare R2, your own server):

```
https://your-cdn.com/rcg-quiz.css
https://your-cdn.com/rcg-quiz.js
```

### Step 2 — Add to Webflow `<head>` (Site Settings → Custom Code)

Paste in **Head Code**:

```html
<!-- RCG Quiz Styles -->
<link rel="stylesheet" href="https://your-cdn.com/rcg-quiz.css">

<!-- Google Fonts (required by the quiz UI) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
```

### Step 3 — Add the Modal Container (Before `</body>`)

Paste in **Footer Code** (or a Webflow Embed block before `</body>`):

```html
<!-- RCG Quiz Modal Container -->
<div id="rcg-quiz-app-modal"></div>

<!-- RCG Quiz Script -->
<script src="https://your-cdn.com/rcg-quiz.js"></script>
```

### Step 4 — Add a Trigger Button

Any element with `data-quiz-trigger="open"` will open the quiz modal on click.

In **Webflow Designer**, add a custom attribute to your button/link:

- Attribute name: `data-quiz-trigger`
- Attribute value: `open`

Or in an Embed block:

```html
<button data-quiz-trigger="open" class="your-webflow-button-class">
  Take the Audit
</button>
```

You can also trigger it programmatically via JavaScript:

```js
window.openQuizApp();
```

---

## ⚙️ Configuration

Open `rcg-quiz.js` and update the `CFG` object at the top of the file:

```js
const CFG = {
    WEBHOOK: 'https://hook.eu2.make.com/YOUR_WEBHOOK_ID',  // Make.com / Zapier webhook
    BOOK_URL: '/contact',                                    // URL for the "Book Training" CTA
    LOOPS_API_KEY: 'YOUR_LOOPS_API_KEY'                     // Loops.so API key for email
};
```

| Key | Purpose |
|---|---|
| `WEBHOOK` | Posts quiz results as JSON to a Make.com / Zapier / n8n webhook. Leave the placeholder to disable. |
| `BOOK_URL` | The page users are sent to when they click "Request Training Proposal". |
| `LOOPS_API_KEY` | Your [Loops.so](https://loops.so) API key. Creates/updates a contact and fires the `quiz_completed` event to trigger your email workflow. Leave the placeholder to disable. |

### Loops.so Email Setup

When a user completes the quiz, the script:
1. Creates or updates a contact in Loops with quiz data as custom properties
2. Fires a `quiz_completed` event

In your Loops dashboard, create an **Event-based journey** triggered by `quiz_completed` to send the results email. The following properties are passed with the event:

| Property | Description |
|---|---|
| `quizScore` | Scaled 0–5.0 score |
| `firstName` | User's first name |
| `quizContext` | Selected professional context |
| `quizRole` | Selected professional role |
| `quizGDV` | Selected annual transaction volume |

---

## 🎨 Styling

All CSS is scoped to `#rcg-quiz-app-modal` — no global styles bleed into your Webflow site. The quiz uses:

- **Inter** — body text and UI
- **Playfair Display** — headings and score display
- **Dark Carbon** colour palette (`#1a1a1a` background, `#990000` / `#ef4444` accents)

To customise colours, find and replace the accent variables in `rcg-quiz.css`:

| Token | Default | Usage |
|---|---|---|
| Primary Red | `#990000` | Primary buttons, CTA |
| Highlight Red | `#ef4444` | Selected options, progress bar |
| Card BG | `#1c1c28` | Question and result cards |
| Muted Text | `#8b8ba0` | Labels, subtitles |

---

## 📤 Data Payload (Webhook)

When a user completes the quiz, the following JSON is POSTed to `CFG.WEBHOOK`:

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "context": "Real Estate Professional",
  "role": "Director / Head of",
  "gdv": "£100M",
  "score": 17,
  "timestamp": "2026-02-27T07:00:00.000Z"
}
```

---

## 📱 Responsive

The quiz is fully responsive. On screens ≤ 600px wide:
- Modal fills the full viewport (no border radius)
- Cards reduce padding
- Title font size reduces to 26px

---

## 🔗 Navigation URLs

The results screen links to:
- **Book Training** → `CFG.BOOK_URL` (default: `/contact`)
- **Methodology** → `/methodology-2`

Update these in `rcg-quiz.js` if your Webflow page slugs differ:

```js
window.book = function () { window.location.href = CFG.BOOK_URL; };
window.methodology = function () { window.location.href = '/methodology-2'; };
```
