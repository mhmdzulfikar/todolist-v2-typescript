import { useState, useEffect } from "react";
import { Snippet, SnippetInput, SnippetUpdate } from "../types/snippet"; // Import yang bener
import { snippetService } from "../services/snippetService";

export const useSnippets = () => {
    // State isinya Snippet (yang ada ID-nya)
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // 1. FETCH
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await snippetService.getAll();
                setSnippets(data);
            } catch (error) {
                console.error("Error fetching snippets", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [refreshKey]);

    // 2. CREATE (Terima input tanpa ID)
    const createSnippet = async (data: SnippetInput) => {
        try {
            await snippetService.create(data);
            setRefreshKey(prev => prev + 1);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    // 3. DELETE
    const deleteSnippet = async (id: number) => {
        try {
            await snippetService.delete(id);
            // Optimistic UI update
            setSnippets(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error(error);
            setRefreshKey(prev => prev + 1);
        }
    };

    // 4. UPDATE
    const updateSnippet = async (id: number, data: SnippetUpdate) => {
        try {
            await snippetService.update(id, data);
            setRefreshKey(prev => prev + 1);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    return { 
        snippets, 
        loading, 
        createSnippet, 
        deleteSnippet, 
        updateSnippet 
    };
};