import SampleController from '@/controllers/sample.controller'; // Changed to default import
import { Router } from 'express';

export class SampleRouter {
  private router: Router;
  private sampleController: typeof SampleController;

  constructor() {
    this.sampleController = SampleController; 
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.sampleController.registerUser);
    this.router.get('/:id', this.sampleController.loginUser);
  }

  getRouter(): Router {
    return this.router;
  }
}