# Hafiz Abdullah Abbas — Portfolio

A premium dark-navy and electric-blue portfolio with animated stars, responsive layouts, a protected admin console, and a separate Contact Center. Built as static HTML/CSS/JS plus Vercel serverless API routes and Supabase storage.

## What's included

- Public sections: Home, About, Studies, Projects, Contact.
- Animated starfield, floating avatar monogram, glass panels, blue glow, and reveal transitions.
- Mobile navigation and responsive layouts.
- Contact form that stores messages in Supabase.
- `/admin.html`: password login and admin dashboard.
- Website Content editor for profile details and skills.
- Projects & Studies editor for adding, changing, and removing entries.
- **Separate Contact Center** for visitor messages, public contact email, and all social links.
- Inbox actions: reply by email, mark read, archive/restore, and delete.
- Admin password and Supabase service-role key remain server-side in environment variables; they are not embedded in HTML or browser JavaScript.

## 1. Create the Supabase database

1. Create a Supabase project.
2. Open **SQL Editor** in the Supabase dashboard.
3. Run the complete contents of `sql/schema.sql`.
4. From **Project Settings → API**, copy the Project URL and `service_role` key. Never put the service-role key in frontend code or commit it to Git.

## 2. Configure environment variables

In Vercel → Project → Settings → Environment Variables, add:

- `SUPABASE_URL` — your Supabase Project URL.
- `SUPABASE_SERVICE_ROLE_KEY` — your Supabase service-role key.
- `ADMIN_PASSWORD` — the admin password you chose. It is stored only as a server environment variable.
- `ADMIN_SESSION_SECRET` — a random secret of at least 32 characters.

Generate a session secret with Node.js:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Apply the variables to Production and Preview as appropriate, then redeploy. Do not commit `.env` files.

For local testing, copy `.env.example` to `.env.local`, fill in the same values, and run `npm install` followed by `npm run dev` (requires the Vercel CLI).

## 3. Deploy to Vercel

1. Upload this folder to a new GitHub repository, or import it directly into Vercel.
2. In Vercel, import the repository. No build command is required for the static pages and serverless functions; the `api/` folder is detected automatically.
3. Add the environment variables above.
4. Deploy. Your public portfolio is `/` and the admin console is `/admin.html`.
5. Test the contact form and confirm the message appears in **Admin → Contact Center → Message Inbox**.

You can use the temporary Vercel deployment URL before buying a custom domain.

## 4. Admin dashboard guide

- **Overview** — message and project counts, plus shortcuts.
- **Website content** — edit your name, headline, about text, location, availability, and skills.
- **Projects & studies** — add, edit, or remove project and education cards.
- **Contact Center** — manage the public email, Discord/YouTube/TikTok/Snapchat links, and visitor messages in a separate inbox.

Admin sessions expire after 8 hours. The login cookie is HttpOnly, Secure, and SameSite=Strict. Use HTTPS (Vercel provides HTTPS automatically).

## Notes / production hardening

- Contact form submissions are stored in the database; this starter does not send email notifications. Use the inbox or reply through your email app.
- Add a CAPTCHA or an edge/WAF rate limit before sharing the public contact form widely.
- Back up the Supabase database periodically.
- The public contact email and social links are editable under **Contact Center**, not mixed into the general content editor.
