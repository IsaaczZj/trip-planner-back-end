import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../erros/client-error";

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/links",
    {
      schema: {
        params: z.object({
          tripId: z.uuid(),
        }),

        body: z.object({
          title: z
            .string()
            .min(4, "O link precisa ter no mínimo 4 caracteres"),
          url: z.url(),
        }),
      },
    },
    async (request) => {
      const { title, url } = request.body;
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });
      if (!trip) {
        throw new ClientError("Viajem não encontrada");
      }

      const link = await prisma.link.create({
        data: {
          title,
          url,
          trip_id: tripId,
        },
      });

      return { link };
    }
  );
}
