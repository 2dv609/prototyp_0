import express from 'express';
import { router as partyRouter } from './party.js';
import { router as multiQuestionRouter } from './multi-question.js';
import { router as triviaRouter } from './trivia.js';
export const router = express.Router();
router.use('/party', partyRouter);
router.use('/multi-question', multiQuestionRouter);
router.use('/trivia', triviaRouter);
router.use('*', (req, res, next) => {
    res
        .status(404)
        .json({
        message: 'No valid path.'
    });
});
