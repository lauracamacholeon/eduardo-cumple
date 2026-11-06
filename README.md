# Invitación de cumpleaños (Angular 18)

1. `npm install` y `npm start` para probar en local.
2. Edita `src/app/config.ts`: nombre, edad, ciudad y claves de EmailJS.
3. Cambia la foto en `src/assets/foto.jpg` si quieres.
4. Sube a GitHub y conecta el repo en Netlify (ya trae `netlify.toml`),
   o ejecuta `npm run build` y arrastra `dist/invitacion/browser` a Netlify Drop.

## EmailJS (confirmación al correo)
- emailjs.com > Email Services > conecta Gmail (SERVICE_ID).
- Email Templates > nuevo, "To email": lauracamacholeon@gmail.com.
  Asunto: Nueva confirmación de {{nombre}}.
  Cuerpo: {{nombre}} confirma para {{asistentes}} persona(s). Acompañantes: {{acompanantes}}. Mensaje: {{mensaje}}
- Account > Public Key. Pega los 3 valores en config.ts.
