import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import { getMaillient } from "../lib/mail";
import nodemailer from "nodemailer";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z
            .string()
            .min(4, "O destino precisa ter no mínimo 4 caracteres"),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.email(),
          emails_to_invite: z.array(z.email()),
        }),
      },
    },
    async (request) => {
      const {
        destination,
        starts_at,
        ends_at,
        owner_name,
        owner_email,
        emails_to_invite,
      } = request.body;

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new Error("Data de início não pode ser antes da data atual!");
      }
      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new Error("Data para finalizar a viajem inválida");
      }

      const newTrip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_0wner: true,
                  isConfirmed: true,
                },
                ...emails_to_invite.map((email) => {
                  return {
                    email,
                  };
                }),
              ],
            },
          },
        },
      });

      const mail = await getMaillient();
      const message = await mail.sendMail({
        from: {
          name: "Equipe plann.er",
          address: "oi@planner.er",
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: "Testando envio de email",
        html: `<p>Teste de envio de email</p>`,
      });
      console.log(nodemailer.getTestMessageUrl(message));

      return {
        newTrip,
      };
    }
  );
}
