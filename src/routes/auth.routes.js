import { signUp } from '#src/controllers/auth.controller.js';
import expresss from 'express';

const router = expresss.Router();

router.post('/sign-up', signUp);

router.post('/sign-in', (req, res) => {
  res.send('POST /api/auth/sign-in response');
});

router.post('/sign-out', (req, res) => {
  res.send('POST /api/auth/sign-out response');
});

export default router;
