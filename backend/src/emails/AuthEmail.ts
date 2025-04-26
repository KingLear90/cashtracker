import { transport } from "../config/nodemailer";

type EmailType = {
    name: string;
    email: string;
    token: string;
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'CashTracker <lic.sanchezalan@gmail.com>',
            to: user.email,
            subject: 'Confirm your account',
            html: `
                <p>Hola ${user.name}, has creado exitosamente tu cuenta y ya está casi lista para utilizarse.</p>
                <p>Visita el siguiente enlace: </p>
                <a href="#">Confirmar cuenta</a>
                <p>e ingresa el siguiente código: <b>${user.token}</b></p>`
        })
        console.log('Mensaje enviado: ', email.messageId);
    }
    
    static sendPasswordResetToken = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'CashTracker <lic.sanchezalan@gmail.com>',
            to: user.email,
            subject: 'Reset password',
            html: `
                <p>Hola ${user.name}, ¿has solicitado reestablecer tu contraseña?</p>
                <p>Visita el siguiente enlace: </p>
                <a href="#">Reestablecer contraseña</a>
                <p>e ingresa el siguiente código: <b>${user.token}</b></p>
                <b>Si no has solicitado reestablecer tu contraseña, ignora este mensaje.</b>`
        })
        console.log('Mensaje enviado: ', email.messageId);
    }
}