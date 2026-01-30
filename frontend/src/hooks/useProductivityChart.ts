import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { todoService } from "../services/todoService";

interface ChartDataItem {
  date: string;
  completed: number;
  pending: number;
}

export const useProductivityChart = () => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

 
    const fetchData = async () => {
      try {
        const todos = await todoService.getAll();

        if (!todos || todos.length === 0) {
          setIsEmpty(true);
          setLoading(false);
          return;
        }

        // 🔥 SATU SUMBER TANGGAL: createdAt
        const grouped = todos.reduce<Record<string, ChartDataItem>>((acc, todo) => {
        
          if (!todo.createdAt) return acc;

          const dateKey = format(
            parseISO(todo.createdAt),
            "dd MMM"
          );

          if (!acc[dateKey]) {
            acc[dateKey] = {
              date: dateKey,
              completed: 0,
              pending: 0,
            };
          }

          if (todo.completed) {
            acc[dateKey].completed += 1;
          } else {
            acc[dateKey].pending += 1;
          }

          return acc;
        }, {});

        const result = Object.values(grouped);

        setChartData(result);
        setIsEmpty(false);

      } catch (error) {
        console.error("Chart error:", error);
        setIsEmpty(true);
      } finally {
        setLoading(false);
      }
    }

     useEffect(() => {
    fetchData();
  }, []);

  return { chartData, loading, isEmpty };
};
