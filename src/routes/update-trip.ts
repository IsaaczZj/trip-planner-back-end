import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";


export async function upadateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/trips/:tripId",
    {
      schema: {
        params: z.object({
          tripId: z.uuid(),
        }),
        body: z.object({
          destination: z
            .string()
            .min(4, "O destino precisa ter no mínimo 4 caracteres"),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
        }),
      },
    },
    async (request) => {
      const { destination, starts_at, ends_at } = request.body;
      const { tripId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });
      if (!trip) {
        throw new Error("Viajem não encontrada");
      }

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new Error("Data de início não pode ser antes da data atual!");
      }
      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new Error("Data para finalizar a viajem inválida");
      }

      const updatedTrip = await prisma.trip.update({
        where: {
          id: tripId,
        },
        data: {
          destination,
          starts_at,
          ends_at,
        },
      });

      return {
        updatedTrip
      };
    }
  );
}
