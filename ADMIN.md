# Admin panel design preview

The admin panel is a separate, local-only Vite preview. It is intentionally outside the public website build and has no server, database, hosting provider configuration, or login. Its example enquiries contain no real patient data. Status changes and video drafts live only in memory and disappear on reload.

Run it locally:

```sh
npm ci
npm run admin:dev
```

Open the local address printed by Vite (normally `http://localhost:8444`). The panel includes responsive overview, enquiry inbox, status filtering, and a video draft form so the layout and flow can be reviewed.

`npm run admin:build` makes a separate `dist-admin/` preview bundle. Do not deploy it as a live admin system. Before real staff or patient data is used, choose the hosting and authentication approach, add a server-enforced login with MFA, protect every data route, and connect secure storage. A browser-only password form would not protect a static site, so none is included in this design preview.
