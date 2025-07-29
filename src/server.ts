import fastify from "fastify";
import { createTrip } from "./routes/create-trip";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import cors from "@fastify/cors";
import { confirmParticipant } from "./routes/confirm-participant";
import { creteActivity } from "./routes/create-activity";
import { getActivities } from "./routes/get-activities";
import { createLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";
import { getParticipants } from "./routes/get-participants";
import { createInvite } from "./routes/create-invite";
import { upadateTrip } from "./routes/update-trip";
import { getTripsDetails } from "./routes/get-trip-details";
import { getParticipant } from "./routes/get-participant";
import { errorHandler } from "./error-handler";
import { env } from "./env";
import { getAllTrips } from "./routes/get-all-trips";
const app = fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: "http://localhost:5173",
});

app.setErrorHandler(errorHandler)

app.register(createTrip);
app.register(confirmTrip);
app.register(confirmParticipant);
app.register(creteActivity);
app.register(getActivities);
app.register(createLink);
app.register(getLinks);
app.register(getParticipants);
app.register(createInvite);
app.register(upadateTrip);
app.register(getTripsDetails);
app.register(getParticipant);
app.register(getAllTrips);
app.listen({ port: env.PORT }).then(() => {
  console.log("Server running");
});
