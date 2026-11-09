# N.R.E.C. Front Page Maker — MERN

Front page aur index page banane wala tool, MERN stack par. Student sirf naam, roll no aur
enrollment no bharta hai; college ka logo, border, subject, paper code, session aur professor
ka naam database se aate hain — isliye har student ka page bilkul ek jaisa banta hai.

Admin (teacher) login karke subject, paper code, session aur index ke topics kabhi bhi badal
sakta hai, aur naya logo/border Cloudinary par upload kar sakta hai.

## Pehle yeh zaroor karo

`server/.env` me tumhare asli credentials bhare hue hain, lekin woh chat me paste ho chuke the.
**MongoDB Atlas ka password, Cloudinary API secret aur JWT_SECRET turant badal do**, warna koi bhi
tumhara database khol sakta hai. Naye values `server/.env` me paste kar dena — `.gitignore` me
`.env` already hai, isliye GitHub par kabhi push nahi hoga.

## Stack

| Hissa    | Kya hai                                                      |
| -------- | ------------------------------------------------------------ |
| Frontend | React 18 + Vite + MUI 5 + React Router, html2canvas (PNG export) |
| Backend  | Express 4 + Mongoose 8                                        |
| Auth     | JWT (bcrypt hashed password)                                  |
| Images   | Cloudinary (logo / border upload)                             |
| DB       | MongoDB Atlas                                                 |

## Folder

```
nrec-frontpage-mern/
├─ server/
│  ├─ .env                 asli values (git me nahi jaata)
│  ├─ .env.example         blank copy
│  └─ src/
│     ├─ index.js          express app
│     ├─ seed.js           admin + default template banata hai
│     ├─ config/           db.js, cloudinary.js
│     ├─ models/           User.js, Template.js
│     ├─ middleware/       auth.js, error.js
│     ├─ controllers/      auth, template, upload
│     └─ routes/           /api/auth, /api/templates, /api/upload
└─ client/
   ├─ public/              frame.png, logo.jpg
   └─ src/
      ├─ pages/            Home.jsx, AdminLogin.jsx, AdminTemplates.jsx
      ├─ components/       CoverPage, IndexPage, PaperStage, IndexEditor,
      │                    ImageDialog, TopBar
      ├─ lib/              fit.js (A4 layout + text fitting), fallback.js
      ├─ theme.js          MUI theme (light + dark)
      └─ styles/           app.css, paper.css
```

## Chalane ka tarika

Do terminal chahiye.

**1. Backend**

```bash
cd server
npm install
npm run seed     # admin user + default template banata hai (sirf ek baar)
npm run dev      # http://localhost:5000
```

**2. Frontend**

```bash
cd client
npm install
npm run dev      # http://localhost:3000
```

Student page: `http://localhost:3000`
Admin login: `http://localhost:3000/login` — email aur password `server/.env` ke
`ADMIN_EMAIL` / `ADMIN_PASSWORD` wale.

## API

| Method | Route                 | Access  | Kaam                                  |
| ------ | --------------------- | ------- | ------------------------------------- |
| GET    | `/api/health`         | public  | server zinda hai ya nahi              |
| POST   | `/api/auth/login`     | public  | token deta hai                        |
| GET    | `/api/auth/me`        | token   | logged-in user                        |
| GET    | `/api/templates`      | public  | saare templates (student page padhta hai) |
| GET    | `/api/templates/:key` | public  | ek template                           |
| POST   | `/api/templates`      | token   | naya template                         |
| PUT    | `/api/templates/:id`  | token   | template update                       |
| DELETE | `/api/templates/:id`  | token   | template delete                       |
| POST   | `/api/upload`         | token   | image → Cloudinary, URL wapas         |

## Production build (ek hi server par dono)

```bash
cd client && npm run build      # client/dist banta hai
cd ../server
# .env me NODE_ENV=production kar do
npm start
```

`NODE_ENV=production` par Express khud `client/dist` serve karta hai, to poora app
`http://localhost:5000` par ek hi URL se chalega. Render / Railway / VPS par deploy karoge to
`CLIENT_URL` me apna asli domain daal dena (CORS ke liye), aur Atlas me us server ka IP allow
kar dena.

## Design ke baare me

Dono pages asli A4 size par bane hain — 794 × 1123 px (96 dpi). Har text ki position original
scan se naapi gayi hai aur percentage me rakhi gayi hai, isliye print par bilkul wahi layout
aata hai.

`client/src/lib/fit.js` me text fitting hai: lamba naam ya lamba subject title apne aap chhota
ho jaata hai taaki line kabhi border se bahar na nikle. Index me 10 se zyada rows daalo to row
height apne aap adjust ho jaati hai, table ek hi page me rehti hai.

Print CSS `@page { size: A4; margin: 0 }` use karti hai, isliye browser ka Print → Save as PDF
seedha 2 saaf A4 pages deta hai. Print karte waqt form aur buttons `no-print` class se chhup
jaate hain.

## UI

Phone par buttons neeche fixed bar me rehte hain (angoothe ke paas), tabs poori chaudai lete
hain, aur ek arrow button seedha preview tak scroll kar deta hai. Bade screen par wahi buttons
preview ke sticky toolbar me chale jaate hain.

MUI 5 par bana hai, apni theme ke saath — palette seedha cover page se li gayi hai (college ka
blue aur subject title ka purple). Light aur dark dono modes hain; toggle top bar me hai aur
choice browser me yaad reh jaati hai. Bade screen par layout do column ka hai: baayen taraf
sticky control panel, daayen taraf dono A4 preview. Phone par sab ek column me aa jaata hai.

### Student khud index edit kar sakta hai

Home page par "Index edit karo" panel khulta hai. Wahan se heading badal sakte ho, kisi bhi row
ka text badal sakte ho, row upar-neeche kar sakte ho, nayi row add ya delete kar sakte ho.

Yeh badlaav sirf us student ke browser me lagte hain — database wala default waisa hi rehta
hai, isliye baaki class par koi asar nahi padta. "Default wapas lao" button ek click me sab
reset kar deta hai. Rows ki ginti badalne par row height apne aap adjust ho jaati hai, table
hamesha ek hi page me rehti hai.

## Chhoti-moti baatein

- Student ke teen fields `localStorage` me yaad rehte hain, server par kuch save nahi hota.
- Server band ho to bhi student page chalta hai — `lib/fallback.js` wala default template use
  ho jaata hai.
- Naya subject add karna ho to admin page par "Naya template" → key unique rakhna.
- Logo aur border `client/public/` me hain. Cloudinary se upload karoge to admin form me URL
  apne aap bhar jaayega.
