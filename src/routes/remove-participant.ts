import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../erros/client-error";

export async function removeParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/trips/:tripId",
    {
      schema: {
        params: z.object({
          tripId: z.uuid(),
        }),
        body: z.object({
          participantId: z.uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { participantId } = request.body;
      const { tripId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });
      if (!trip) {
        throw new ClientError("Viajem não encontrada");
      }

      const participant = await prisma.participant.findFirst({
        where: {
          id: participantId,
          trip_id: tripId,
        },
      });
      if (!participant) {
        throw new Error("Participante não encontrado");
      }
      if (participant.is_owner) {
        throw new Error("Não é possivel remover o organizador da viajem!");
      }
      await prisma.participant.delete({
        where: {
          id: participantId,
        },
      });

      return reply.status(204).send();
    }
  );
}
