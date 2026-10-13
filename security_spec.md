# Security Specification for Fresh Perspective Organization

## 1. Data Invariants
1. **Public Read-Only Content**: Published records in `professionals`, `services`, `projects`, `gallery`, `leadership`, `insights`, `events`, `publications`, `faqs`, and `site_settings` are accessible for read operations by anonymous and public visitors.
2. **Draft / Unpublished Isolation**: Non-published content (`isPublished == false`) is only readable by authenticated administrators.
3. **Inquiry Protection (Zero Public Read)**: Inquiries submitted by visitors contain contact and personal information (fullName, email, phone, budget). Public visitors may ONLY create an inquiry. They can NEVER list, get, update, or delete any inquiry.
4. **Admin Authorization Barrier**: All mutations (create, update, delete) to site content, team profiles, gallery, services, and leadership require authenticated admin privileges (either verified email matching official administrators or existence in `/admins/{uid}`).
5. **Storage Security**: Only authenticated administrators can upload, replace, or delete media assets in Firebase Storage. Public visitors have read-only access to download published media assets.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Public Reading Inquiries**: Malicious client requests `GET /inquiries/{inquiryId}` without authentication -> MUST RETURN PERMISSION_DENIED.
2. **Inquiry Listing Attack**: Public visitor attempts `LIST /inquiries` -> MUST RETURN PERMISSION_DENIED.
3. **Malicious Content Injection**: Unauthenticated user sends `POST /professionals` with fake team credentials -> MUST RETURN PERMISSION_DENIED.
4. **Oversized Inquiry Payload (Denial of Wallet)**: Attacker sends 1MB description string to `/inquiries` -> MUST BE BLOCKED BY SIZE RULE.
5. **Admin Role Self-Escalation**: Regular user signs in and attempts `POST /admins/{their_uid}` with `{ "role": "admin" }` -> MUST RETURN PERMISSION_DENIED.
6. **Setting Manipulation**: Unauthenticated user sends `UPDATE /site_settings/general` -> MUST RETURN PERMISSION_DENIED.
7. **Inquiry Status Tampering**: Visitor sends `POST /inquiries` with `{ "status": "reviewed" }` or non-whitelisted fields -> MUST RETURN PERMISSION_DENIED.
8. **Unauthenticated Gallery Deletion**: Attacker attempts `DELETE /gallery/{galleryId}` -> MUST RETURN PERMISSION_DENIED.
9. **Fake Publication Injection**: Unauthenticated user attempts `POST /publications` -> MUST RETURN PERMISSION_DENIED.
10. **Storage File Overwrite**: Malicious user attempts `PUT /storage/team/ceo.jpg` without admin token -> MUST BE BLOCKED BY STORAGE RULES.
11. **Draft Leakage**: Unauthenticated query attempts to read unpublished drafts -> MUST BE BLOCKED BY `isPublished == true` GATE.
12. **Ghost Field Update**: Authenticated user with invalid credentials attempts update -> MUST BE REJECTED.
