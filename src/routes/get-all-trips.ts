import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../erros/client-error";

export async function getAllTrips(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/all",

    async (request, reply) => {
      const trips = await prisma.trip.findMany();
      if (!trips) {
        throw new ClientError("Viajens nao encontradas");
      }

      reply.status(200).send({ trips });
    }
  );
}
