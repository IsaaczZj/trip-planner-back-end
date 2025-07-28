import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trip/:tripId/confirm",
    {
      schema: {
        params: z.object({
          tripId: z.uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!trip) {
        throw new Error("Viajem não encontrada");
      }
      if (trip.isConfirmed) {
        return reply.redirect(`http://localhost:5173/trips/${tripId}}`);
      }

      await prisma.trip.update({
        where: {
          id: tripId,
        },
        data: {
          isConfirmed: true,
        },
      });

      // const formattedStartDate = dayjs(starts_at).format("LL");
      // const formattedEndDate = dayjs(ends_at).format("LL");

      const confirmationLink = `http://localhost:3333/trips/${newTrip.id}/confirm`;

      const mail = await getMaillient();

      return { tripId: request.params.tripId };
    }
  );
}
