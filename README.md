# Fresh Perspective Organization Website

A professional, production-ready corporate website for **Fresh Perspective Organization** — an international creative services, corporate consulting, and digital solutions agency.

> **Motto & Tagline:** *Timely Delivery With Valuable Works Done*  
> **Official Email:** freshperspectiveorganization@gmail.com  
> **WhatsApp Channel:** +234 903 186 0768

---

## Technology Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Authentication:** Firebase Authentication (Google Sign-In & custom authorized admin credentials)
- **Database:** Cloud Firestore for persistent real-time content, team directory, and quote inquiries
- **Storage:** Firebase Storage for permanent photo and media asset hosting
- **Deployment Targets:** Vercel, GitHub, and Cloud Run / AI Studio

---

## 1. Firebase Project Setup

The application is configured to connect to Firebase. All config parameters are initialized in `firebase-applet-config.json` and loaded by `src/firebase.ts`.

### Enabling Firebase Services:
1. **Cloud Firestore:**
   - Go to [Firebase Console](https://console.firebase.google.com/) -> Build -> **Firestore Database**.
   - Create Database in production mode (rules defined in `firestore.rules`).
2. **Firebase Authentication:**
   - Go to Firebase Console -> Build -> **Authentication** -> Sign-in method.
   - Enable **Google Provider**.
   - Ensure the domain (e.g. `*.run.app`, `localhost:3000`, `*.vercel.app`) is added to **Authorized Domains**.
3. **Firebase Storage:**
   - Go to Firebase Console -> Build -> **Storage**.
   - Click **Get Started** and deploy the rules defined in `storage.rules`.

---

## 2. Environment Variables & GitHub / Vercel Deployment

For deployment on Vercel or your production server:

1. Copy the variables from `firebase-applet-config.json` or define the following in your Vercel project environment variables:
   ```env
   VITE_FIREBASE_PROJECT_ID=conductive-cell-wzp2g
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=conductive-cell-wzp2g.firebaseapp.com
   VITE_FIREBASE_STORAGE_BUCKET=conductive-cell-wzp2g.firebasestorage.app
   ```
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`

---

## 3. Administrator Portal Logins

To access the `/admin` portal:
1. Click the **Admin** button in the header or footer of the website.
2. Sign in using the designated credentials:
   - **Email:** `freshperspectiveorganization@gmail.com`
   - **Password:** `fresh@org`
3. Alternatively, administrators may sign in using Google Auth with `danielowino233@gmail.com` or `freshperspectiveorganization@gmail.com`.
4. From the admin dashboard, you can upload the **CEO Photograph** (which appears right after the hero landing section), manage specialist profiles, services, case studies, gallery photos, and view incoming quote inquiries.

---

## 4. Email Notification Configuration

When a visitor submits an inquiry via the **Request a Quote & Project Brief** form:
1. The submission is validated and written to Cloud Firestore in the `inquiries` collection.
2. The submission appears immediately inside the Administrator Portal's **Inquiries & Quotes Inbox**.
3. To enable automatic automated email notifications to `freshperspectiveorganization@gmail.com`:
   - **Option A (Firebase Extensions):** Install the official *Trigger Email from Firestore* extension in the Firebase Console and configure it with your SMTP provider (SendGrid, Mailgun, or Resend).
   - **Option B (Cloud Functions):** Deploy an `onDocumentCreated('inquiries/{id}')` Firebase function that dispatches an email notification via Nodemailer or Resend.
   - **Direct Outreach:** Administrators can click **Reply via Email** or **Open WhatsApp** directly from the Inquiries table to contact the prospective client immediately.

---

## 5. Security Rules

### Firestore Security (`firestore.rules`)
- **Public Read:** Visitors can read published services, team profiles, gallery photos, and settings (`isPublished == true`).
- **Visitor Writes:** Visitors can ONLY create inquiries with strict type and size constraints (`description.size() <= 2000`, `fullName.size() <= 100`). Visitors CANNOT read other users' inquiries.
- **Admin Writes:** Only authenticated administrators matching the authorized list can create, update, or delete content.

### Storage Security (`storage.rules`)
- **Public Read:** Allowed for published image assets.
- **Admin Uploads:** Strictly restricted to authenticated users with max file size of 10MB and valid image MIME types (`image/*`).

---

## 6. Official Social Media Channels

- **Facebook:** [https://www.facebook.com/share/19DdJcZDxF/](https://www.facebook.com/share/19DdJcZDxF/)
- **Instagram:** [https://www.instagram.com/chibukingtechnology](https://www.instagram.com/chibukingtechnology)
- **LinkedIn:** [https://www.linkedin.com/company/fresh-prespective/](https://www.linkedin.com/company/fresh-prespective/)
- **TikTok:** [https://www.tiktok.com/@fresh.perspective7](https://www.tiktok.com/@fresh.perspective7)
- **X (Twitter):** [https://x.com/MChibuking](https://x.com/MChibuking)
- **Telegram:** [https://t.me/FreshPerspectiv](https://t.me/FreshPerspectiv)
- **YouTube:** [https://youtube.com/@michealchibuking?si=QYxm6mnDs865i90e](https://youtube.com/@michealchibuking?si=QYxm6mnDs865i90e)
- **WhatsApp:** [https://wa.me/2349031860768](https://wa.me/2349031860768)
- **Email:** [mailto:freshperspectiveorganization@gmail.com](mailto:freshperspectiveorganization@gmail.com)
