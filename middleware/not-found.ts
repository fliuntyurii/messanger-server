import { Response } from "express";
import { AuthenticatedRequest } from "../types/index.type";

const notFound = (req: AuthenticatedRequest, res: Response) => res.status(404).send('Route does not exist')

export default notFound;
