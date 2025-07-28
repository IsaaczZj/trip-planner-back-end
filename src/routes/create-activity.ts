import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";

export async function creteActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/activities",
    {
      schema: {
        params: z.object({
          tripId: z.uuid(),
        }),

        body: z.object({
          title: z
            .string()
            .min(4, "O título precisa ter no mínimo 4 caracteres"),
          occurs_at: z.coerce.date(),
        }),
      },
    },
    async (request) => {
      const { title, occurs_at } = request.body;
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });
      if (!trip) {
        throw new Error("Viajem não encontrada");
      }
      if (dayjs(occurs_at).isBefore(trip.starts_at)) {
        throw new Error("Data da atividade inválida");
      }
      if (dayjs(occurs_at).isAfter(trip.ends_at)) {
        throw new Error("Data da atividade inválida");
      }

      const activity = await prisma.activity.create({
        data: {
          title,
          occurs_at,
          trip_id: tripId,
        },
      });

      

      return { activity };
    }
  );
}
