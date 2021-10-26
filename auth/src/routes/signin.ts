import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@ahttickets/common';

import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    // .select({ password: 1 });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const userJWT = jwt.sign(
      {
        email,
        id: existingUser.id,
      },
      process.env.JWT_KEY!
    );

    // Store it on the session object
    req.session = {
      jwt: userJWT,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
