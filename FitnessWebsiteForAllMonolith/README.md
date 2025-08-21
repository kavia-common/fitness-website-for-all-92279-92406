# Fitness Website For All - Monolith Frontend (React)

A comprehensive, accessible React frontend for Fitness Website For All. It implements:
- End-user flows: registration, login, profile, goals, plans, content, community/forums, notifications, device connection integration points.
- Admin panel: users, content, audit logs, settings.
- Responsive WCAG 2.1 AA conscious UI and keyboard/screen-reader friendly components.
- API integration layer with token handling.
- Cypress E2E test hooks.

## Getting Started

1. Copy .env.example to .env and set variables:
```
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_WS_BASE_URL=ws://localhost:8000/ws
REACT_APP_SITE_URL=http://localhost:3000
REACT_APP_ENABLE_DEVICE_CONNECT=true
REACT_APP_ENABLE_FORUMS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

2. Install dependencies:
```
npm install
```

3. Run dev server:
```
npm start
```

4. Run tests:
```
npm test
```

5. Run Cypress E2E:
```
npm run cypress:open
# or headless:
npm run cypress:run
```

## Project Structure

- src/services/api.js: Axios client and API modules (Auth, User, Content, Forum, Admin). Tokens are stored in localStorage and attached as Bearer tokens.
- src/context/AuthContext.js: AuthProvider with login/register/logout and user state (me endpoint).
- src/components: Navbar, Footer, ProtectedRoute, form inputs.
- src/pages: Home, Login, Register, Profile (goals + device connect), Content (list/detail/Plans), Community (list/detail/new), Admin dashboard, Forbidden.
- src/styles: tokens.css and base.css for consistent theming and accessibility.

## Accessibility

- Semantic landmarks (nav, main, footer).
- Keyboard focus styles and aria-labels/roles where helpful.
- Form errors use role="alert", notifications use aria-live="polite".
- Color contrast and dark/light theme toggling.

## API Contract Notes

This frontend expects a backend with endpoints similar to:
- POST /auth/login/, POST /auth/register/, GET /auth/me/, POST /auth/logout/
- GET/PUT /users/profile/, PUT /users/goals/
- GET /content/, GET /content/{id}/
- POST /plans/generate/, POST /plans/progress/
- GET /forums/topics/, GET /forums/topics/{id}/, POST /forums/topics/, POST /forums/topics/{id}/reply/
- GET /notifications/, POST /notifications/{id}/read/
- Admin: GET /admin/users/, GET/POST/PUT /admin/content(/:id)/, GET /admin/audit-logs/, GET/PUT /admin/settings/
- Device connect: POST /devices/connect/{provider}/ returns { redirect_url?: string }

Adjust service endpoints in src/services/api.js if your backend differs.

## Security & Privacy

- Tokens are persisted in localStorage; consider using httpOnly cookies if available.
- No secrets are committed; use .env for config.
- Admin routes are gated by user.is_admin or user.is_staff flag from /auth/me.

## Cypress

Basic sanity tests located in cypress/e2e/sanity.cy.js to verify navigation and form presence. Add more flows once backend is available.

## License

Internal project template for Kavia tasks.
