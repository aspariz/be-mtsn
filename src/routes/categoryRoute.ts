import { Router } from 'express';
import { CategoryController } from '../controller/categoryController';

const router = Router();

router.get('/categories', CategoryController.getAll);
router.post('/categories', CategoryController.create);
router.put('/categories/:id', CategoryController.update);
router.delete('/categories/:id', CategoryController.delete);

export default router;