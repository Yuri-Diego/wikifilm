import { Router } from 'express';
import { ShareLinksController } from '../controllers/shareLinks.controller.js';

const router = Router();

router.post('/', ShareLinksController.create);
router.get('/:shareId', ShareLinksController.getByShareId);

export default router;
