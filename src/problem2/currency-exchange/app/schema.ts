import { z } from "zod";

export const ExchangeSchema = z.object({
    source: z.number().optional(),
    target: z.number().optional(),
})