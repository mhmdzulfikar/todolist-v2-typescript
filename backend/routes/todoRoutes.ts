import express, { Router} from 'express';

import {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
} from '../controllers/todoController';

const router: Router = express.Router();

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;