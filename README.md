# Studio Ledger

A responsive back-office prototype for a solo freelance design studio. It keeps client details, invoices, payment follow-ups, business bills and a 30/60/90-day cash view in one place, so the owner can see who owes what, since when, and whether there will be enough cash for upcoming costs.

## The problem

Micro-businesses such as freelancers, shopkeepers, tutors and small clinics often track money in WhatsApp chats, notebooks and spreadsheets. Invoices go unsent, payments go unchased, and the owner cannot easily say who owes what or whether next month's rent, salaries and supplier bills are covered. Studio Ledger is built for a one-person back office and focuses on the money questions: who owes me, how much, since when, and what do I do today?

## Who it is for

A solo or small (1 to 5 person) business with no accounting or admin staff. The current sample persona is a freelance design studio, "Made by Mira", with sample clients and sample invoices in INR.

## Project Links

- **GitHub repository:** https://github.com/JyothiSrinivasan/studio-ledger
- **Live app:** https://studio-ledger-eoy.pages.dev
- **Demo video:** [See Studio Ledger in action](https://www.youtube.com/watch?v=O4H09XuqlqU)
- **Project presentation:** [View the PowerPoint](presentation/Studio_Ledger_Hackathon_Jyothi.pptx)
- **Local version:** Run the project locally using the instructions below.

<img width="2545" height="1078" alt="studio_ledger_" src="https://github.com/user-attachments/assets/e265044c-4fab-41e8-9069-44c77739c342" />

## Codebenders usage and build iterations

Codebenders was used as the development environment to build and refine Studio Ledger. I used its coding workspace to work on the React and Vite app, review changes in the browser, and troubleshoot issues during development.

### Key prompt themes

These examples summarize the prompts used; they are paraphrases, not verbatim prompt logs.

- “Create a clear, welcoming back-office dashboard for a solo freelance design studio. Make invoices, overdue payments, bills, and cash position easy to understand.”
- “Add client and invoice workflows, including invoice details and a polite reminder the owner can copy.”
- “Connect the invoice and bill information to a 30-, 60-, and 90-day cash view, with a what-if scenario for a client paying 15 days late.”
- “Help debug the forecast calculations, chart data shape, and rendering errors, then check the result in the browser.”
- “Make the README and project presentation clear about the prototype’s features, sample data, and limitations.”

### Iterations

1. **Defined the user and problem:** Focused the product on Mira, a freelance design studio owner who needs a quick way to see who owes her and what needs attention.
2. **Built the main workflows:** Added the overview dashboard, invoices, clients, payment follow-ups, bills, and monthly summary.
3. **Refined the cash view:** Iterated on invoice and bill timing, the forecast chart, and the 15-day late-payment scenario using sample records.
4. **Debugged and reviewed:** Used Codebenders to inspect the project files, trace errors, and fix issues across the app. After each change, I checked the browser and terminal output to confirm the app still worked.
5. **Prepared the submission:** Updated the presentation and README, pushed the project to GitHub, and deployed the app to Cloudflare Pages.

The figures and forecast are illustrative prototype data. See **Current scope and next steps** for limitations.

## Features

- **Overview dashboard**: an alert banner for overdue invoices, four metric cards (Outstanding, Collected this month, Next 30 days, Cash on hand), a cash forecast chart, a "Needs your attention" card, the latest unpaid invoices and recent payments.
- **Cash forecast chart**: a 30, 60 or 90 day area chart based on unpaid invoices and upcoming unpaid bills. The "What if Northstar pays 15 days late?" toggle shifts Northstar's expected payment by 15 days to show how the timing affects projected cash.
- **Invoices**: a searchable table of all invoices with status, due date and days late, plus summary totals for Outstanding, Overdue and Paid this month.
- **Invoice details drawer**: opens from any invoice row and shows the amount, dates and terms, a drafted payment reminder with a Copy message button, a "Mark as paid" action and a Download invoice action.
- **Create an invoice**: choose a client, describe the work, enter an amount and a due date.
- **Clients**: a card grid of clients with contact name, email and a shortcut to that client's invoices. Add a client with name, contact and email.
- **Monthly cash summary**: pick a month to see collected payments, invoices issued, outstanding and overdue amounts, bills paid and bills still due, net cash movement, and a suggested next step. Download the summary as a CSV file.
- **Bills**: add a business bill (for example studio rent) with a name, amount, due date and status, then mark it paid from the monthly summary.
- **Responsive layout**: the sidebar collapses into a menu on small screens, and tables and cards reflow for mobile widths.

## Tech stack

- React 18+ with function components and hooks (`useState`, `useMemo`, `useEffect`)
- Vite for the development server and production build
- Recharts for the cash forecast chart
- lucide-react for icons
- Plain CSS in `style.css`, using the DM Sans and Manrope fonts from Google Fonts
- Browser `localStorage` for saving data (no backend)

## Project structure

```
studio-ledger/
├── index.html      Page shell with a <div id="root"> and the script entry src.jsx
├── src.jsx         The whole application: data, state, screens and components
├── style.css       All styling, including responsive rules
├── package.json    Scripts and dependencies
├── package-lock.json
└── README.md       This file
```

## Getting started

Requirements: Node.js 18 or newer and npm.

1. Install dependencies:
   ```
   npm install
   ```
2. Windows PowerShell note:
   if npm install is blocked by an execution policy, run npm.cmd install and npm.cmd start instead.

3. Start the development server:
   ```
   npm start
   ```
   Vite prints a local address, usually http://localhost:5173/. Open it in your browser. The server is set to listen on all interfaces, so other devices on the same network can open it using your computer's IP address and the same port.
4. Build for production:
   ```
   npm run build
   ```
   The output is written to the `dist/` folder.

## How data flows

1. **Sample data**: `src.jsx` contains the starting clients, invoices and bills. These are used when nothing has been saved yet.
2. **State**: `App` keeps clients, invoices, bills and screen state (current tab, open drawer or modal, search text, scenario toggle, selected forecast period) in React state.
3. **Derived values**: totals, overdue lists, days late, the monthly summary and the cash forecast are calculated from current app data. The forecast adds unpaid invoices when they're expected to be collected and subtracts unpaid bills when they're due. Overdue invoices are assumed to be collected seven days after the demo's current date.
4. **Actions**: creating an invoice or client, adding a bill, marking an invoice or bill as paid, and copying a reminder all update state and show a confirmation message.
5. **Saving**: changes are written to `localStorage` in the browser, so they remain after a reload on the same browser and device. Data is not shared between browsers or devices.

## Key concepts

- **Outstanding**: the total of all invoices that are not marked Paid.
- **Overdue**: an unpaid invoice whose due date has passed. Days late are counted from the due date.
- **Collected**: payments recorded in the selected month.
- **Net cash movement**: collected payments minus bills paid in the selected month.
- **Delay scenario**: shifts Northstar Coffee's expected payment date by 15 days and shows how that timing changes the cash forecast. It may change the timing of the curve without changing the 90-day ending balance if the payment still arrives within that period.
- **Comfort buffer**: a reference line at ₹1,00,000 on the cash chart.

## Known limitations

This is a prototype. Some values are still sample or fixed values, and some parts of the planned behaviour are not yet built:

- The forecast is illustrative. It assumes overdue invoices will be collected seven days after the demo date and depends on the dates and amounts entered.
- Some overview figures remain fixed sample values, including *Collected this month* and *Cash on hand*. The "Next 30 days" card totals unpaid invoices expected within 30 days; its bills-out figure is based on upcoming bills.
- Invoice status labels such as "Overdue" and "Due soon" are set when the data is created and do not change automatically as dates pass.
- Mark sent on a reminder shows a confirmation but does not record anything.
- There is no login, no backend, no multi-user support, and no real email or WhatsApp sending.
- Invoice PDFs are not generated; the download button shows a confirmation only.
- Data lives in one browser. Clearing browser storage removes it.

## Roadmap

- Derive all Overview figures (collected, next 30 days, cash on hand, runway) from the same data as the monthly summary.
- Update invoice status automatically from due dates.
- Sort the attention list by days overdue and amount.
- Add a real payment record per invoice, including partial payments.
- Add recurring bills and an estimated monthly cost for the runway figure.
- Generate printable invoice PDFs and drafted reminders for WhatsApp and email.

## Pricing and positioning (draft)

Target: solo freelancers and micro-businesses who track money in notebooks or chats. The app is intended to be cheaper than an accounting package and simpler than a full bookkeeping tool, with the focus on chasing payments and seeing the next 30 to 90 days of cash. A monthly solo plan (the sidebar shows "Solo plan") is the planned model; the price is not yet set.

## Licence

No open-source licence has been selected. All rights reserved by the project author, subject to the hackathon’s applicable ownership and submission terms.
