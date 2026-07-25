export interface ExamplePrompt {
  id: string;
  title: string;
  query: string;
  schemaId: string;
  mode: 'SQL' | 'Excel' | 'Both';
  badge?: string;
}

export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    id: 'ex1',
    title: 'Average sales by region',
    query: 'Find total and average sales amount grouped by Region for completed orders',
    schemaId: 'orders',
    mode: 'Both',
    badge: 'Popular'
  },
  {
    id: 'ex2',
    title: 'Find duplicate emails',
    query: 'Identify duplicate customer email addresses and count how many times each appears',
    schemaId: 'orders',
    mode: 'SQL',
    badge: 'Common'
  },
  {
    id: 'ex3',
    title: 'Rank employees by salary',
    query: 'Rank employees by salary within each department from highest to lowest salary',
    schemaId: 'employees',
    mode: 'Both',
    badge: 'Window Func'
  },
  {
    id: 'ex4',
    title: 'Running total of revenue',
    query: 'Calculate a cumulative running total of Order Amount ordered by OrderDate',
    schemaId: 'orders',
    mode: 'Both',
    badge: 'Advanced'
  },
  {
    id: 'ex5',
    title: 'Last 30 days sales',
    query: 'Get all order transactions created in the last 30 days with Status = Completed',
    schemaId: 'orders',
    mode: 'Both',
    badge: 'Filter'
  },
  {
    id: 'ex6',
    title: 'Top 5 products by stock',
    query: 'Find top 5 most expensive active products with unit price above $50',
    schemaId: 'products',
    mode: 'SQL',
    badge: 'Top N'
  },
  {
    id: 'ex7',
    title: 'VLOOKUP employee name',
    query: 'Look up Employee Name using EmpID from another sheet and return default "Not Found" if blank',
    schemaId: 'employees',
    mode: 'Excel',
    badge: 'Excel'
  },
  {
    id: 'ex8',
    title: 'Pivot monthly sales',
    query: 'Summarize total sales amount by month and year with total count of orders',
    schemaId: 'sales',
    mode: 'Both',
    badge: 'Aggregation'
  }
];
