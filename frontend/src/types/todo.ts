// src/types/todo.ts

export interface Todo {
    id: number;
    task: string;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Tipe data buat Payload Create (ID & Date digenerate backend)
export interface CreateTodoDTO {
    task: string;
}

// Tipe data buat Update (Bisa cuma completed, atau task aja)
export interface UpdateTodoDTO {
    task?: string;
    completed?: boolean;
}