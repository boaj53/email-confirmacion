import { Resend } from 'resend';
import fs from 'fs/promises';
import Handlebars from 'handlebars';

const resend = new Resend('re_T3rqQ1GP_CDHfyakL1s9mmXWzxyAWhp7X');

// Direcciones de correo electrónico de los usuarios y el estado de su registro
const usuarios = [
  { correo: 'jhoniboaj53@gmail.com', estado: 'pendiente', nombre: "Enrique" },
  // { correo: 'jhoniboaj53@gmail.com', estado: 'rechazado', nombre: "Enrique" },
  // { correo: 'jhoniboaj53@gmail.com', estado: 'pendiente', nombre: "Enrique" }
];

(async function () {
  try {
    // Leer el contenido de la plantilla de correo electrónico
    const plantillaCorreo = await fs.readFile('correo_usuario.html', 'utf8');

    for (const usuario of usuarios) {
      let asunto, contenido;

      switch (usuario.estado) {
        case 'aceptado':
          asunto = '¡Bienvenido a nuestra aplicación! ' + usuario.nombre;
          contenido = '¡Gracias por registrarte en nuestra aplicación! Esperamos que disfrutes de tu experiencia con nosotros.';
          break;
        case 'rechazado':
          asunto = 'Tu solicitud ha sido rechazada ' + usuario.nombre;
          contenido = 'Lamentamos informarte que tu solicitud de registro ha sido rechazada.';
          break;
        case 'pendiente':
          asunto = 'Tu solicitud está pendiente ' + usuario.nombre;
          contenido = 'Hemos recibido tu solicitud de registro. Te informaremos tan pronto como se procese.';
          break;
        default:
          console.error(`Estado de registro no válido para el usuario ${usuario.correo}`);
          continue;
      }

      // Compilar la plantilla con los datos específicos del usuario
      const template = Handlebars.compile(plantillaCorreo);
      const correoHtml = template({ asunto, contenido });

      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [usuario.correo],
        subject: asunto,
        html: correoHtml,
      });

      if (error) {
        console.error(`Error al enviar correo electrónico a ${usuario.correo}:`, error);
      } else {
        console.log(`Correo electrónico enviado correctamente a ${usuario.correo}`);
        console.log('Respuesta del servidor:', data);
      }
    }
  } catch (error) {
    console.error('Error al leer la plantilla de correo electrónico:', error);
  }
})();
