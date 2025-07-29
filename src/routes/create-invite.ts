import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMaillient } from "../lib/mail";
import nodemailer from "nodemailer";
import { ClientError } from "../erros/client-error";
import { env } from "../env";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/invites",
    {
      schema: {
        params: z.object({
          tripId: z.uuid(),
        }),

        body: z.object({
          email: z.email(),
        }),
      },
    },
    async (request) => {
      const { email } = request.body;
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });
      if (!trip) {
        throw new ClientError("Viajem não encontrada");
      }

      const participant = await prisma.participant.create({
        data: {
          email,
          trip_id: tripId,
        },
      });

      const formattedStartDate = dayjs(trip.starts_at).format("LL");
      const formattedEndDate = dayjs(trip.ends_at).format("LL");

      const mail = await getMaillient();

      const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;
      const message = await mail.sendMail({
        from: {
          name: "Equipe plann.er",
          address: "oi@planner.er",
        },
        to: participant.email,
        subject: `Confirme sua presença na viajem para ${trip.destination} em ${formattedStartDate}`,
        html: `
                          <div style="font-family: sans-serif; font-size:16px; line-height: 1.6;">
                            <p>Você foi convidado para participar de uma viajem para <strong>${trip.destination}</strong> nas datas de ${formattedStartDate} até ${formattedEndDate}</p>
                            <p></p>
                            <p>Para confirmar a sua presença na viagem, clique no link abaixo</p>
                            <p></p>
                            <p>
                              <a href="${confirmationLink}">Confirmar viagem</a>
                            </p>
                            <p></p>
                            <p>Caso você não saiba do que se trata o e-mail, apenas ignore-o</p>
                          </div>
                
                        `.trim(),
      });
      console.log(nodemailer.getTestMessageUrl(message));

      return { participant };
    }
  );
}
