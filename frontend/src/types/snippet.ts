// 1. Data Matang (Dari Database, WAJIB ada ID)
export interface Snippet {
    id: number;
    title: string;
    language: string;
    code: string;
}

// 2. Data Mentah (Buat Create, ID GAK BOLEH ADA)
export interface SnippetInput {
    title: string;
    language: string;
    code: string;
}

// 3. Data Update (ID Wajib, sisanya boleh diedit separo)
// Kita pake Partial biar gak usah ngetik ulang
export type SnippetUpdate = Partial<SnippetInput> & { id: number };