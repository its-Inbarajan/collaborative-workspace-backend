import { Router } from 'express';
import { createJob } from './job.controller';


const jobRouter = Router();

jobRouter.post('/jobs', createJob)

export default jobRouter