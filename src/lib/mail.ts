import nodemailer from 'nodemailer'

export async function getMaillient() {
  const account = await nodemailer.createTestAccount()

  const trasnporter = nodemailer.createTransport({
    host:'smtp.ethereal.email',
    port:587,
    secure:false,
    auth:{
      user:account.user,
      pass: account.pass
    }
  })
  return trasnporter
}