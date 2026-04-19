import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Factory that returns an Express middleware validating `req.body`, `req.query`,
 * or `req.params` against the supplied Zod schema.
 *
 * Usage:
 *   router.post("/register", validate(registerSchema), handler);
 *   router.get("/search", validate(searchSchema, "query"), handler);
 */
export function validate(
    schema: z.ZodType,
    source: "body" | "query" | "params" = "body"
) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const messages = result.error.issues.map((issue: z.core.$ZodIssue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            res.status(400).json({
                success: false,
                error: "Validation failed",
                details: messages,
            });
            return;
        }

        // Overwrite with parsed/transformed data so handlers see clean values
        (req as any)[source] = result.data;
        next();
    };
}
