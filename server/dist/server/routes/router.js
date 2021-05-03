import express from 'express';
import { router as partyRouter } from './party.js';
import { router as triviaRouter } from './trivia.js';
import { router as backToBackRouter } from './back-to-back.js';
export const router = express.Router();
router.use('/party', partyRouter);
router.use('/trivia', triviaRouter);
router.use('/back-to-back', backToBackRouter);
router.use('*', (req, res, next) => {
    res
        .status(404)
        .json({
        message: 'No valid path.'
    });
});
