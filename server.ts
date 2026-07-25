import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

// Lazy initializer for GoogleGenAI
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. Generate SQL & Excel Query API
app.post("/api/generate", async (req, res) => {
  try {
    const { userQuery, schema, mode = 'Both', dbType = 'PostgreSQL', excelVersion = '365', language = 'English' } = req.body;

    if (!userQuery || typeof userQuery !== 'string' || !userQuery.trim()) {
      return res.status(400).json({ error: "User query is required." });
    }

    const ai = getGenAIClient();

    const systemInstruction = `You are an expert Principal Data Engineer, Database Administrator, and Excel Formulas Master.
Your goal is to convert natural language requests into production-grade SQL queries and Excel formulas.

PROMPT RULES & BEST PRACTICES:
1. Always strictly adhere to the user's provided schema/table structure if provided. Never invent table names or columns if schema is present.
2. If no schema is provided, use logical generic table and column names, and briefly mention in the explanation that generic names were used.
3. Database Dialect: Customize SQL specifically for ${dbType} (syntax, functions, string concatenation, date functions).
4. Excel Version: Customize formula specifically for Excel ${excelVersion} (e.g. XLOOKUP/LET/FILTER/UNIQUE for 365, INDEX+MATCH / VLOOKUP / SUMIFS for 2019/2016).
5. Output Mode requested: ${mode}.
   - If mode is 'SQL', provide valid SQL query. If Excel formula is not applicable, output N/A or a note.
   - If mode is 'Excel', provide valid Excel formula. If SQL is not applicable, output N/A or a note.
   - If mode is 'Both', provide both valid SQL and Excel formula.
6. SQL Best Practices:
   - Use clear, expressive aliases.
   - Avoid 'SELECT *' unless specifically requested; explicitly name columns.
   - Use window functions (RANK, DENSE_RANK, ROW_NUMBER, SUM() OVER) where appropriate.
   - Prefer readable CTEs (WITH clause) for multi-step logic.
7. Output JSON strictly matching the provided schema. Explanation should be concise, professional, and accessible to both beginners and experts.
8. Common Mistake: Mention a realistic mistake users often make with this type of query or formula (e.g., forgetting NULL handling, off-by-one ranges, integer division, unindexed columns).
9. Optimization Tip: Mention a specific performance or formula efficiency tip (e.g., adding an index on foreign keys, using XLOOKUP instead of VLOOKUP, avoiding volatile functions).
10. Respond in ${language}.`;

    const promptText = `
User Query: "${userQuery}"

${schema ? `Table Schema / Columns Provided:\n${schema}` : 'No explicit schema provided. Use standard domain-appropriate table and column names.'}

Mode: ${mode}
Target Database: ${dbType}
Excel Version: ${excelVersion}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sql_query: {
              type: Type.STRING,
              description: "The formatted, production-grade SQL query tailored to the specified database engine."
            },
            excel_formula: {
              type: Type.STRING,
              description: "The Excel formula tailored to the specified Excel version."
            },
            explanation: {
              type: Type.STRING,
              description: "A clear, simple, step-by-step explanation of how the query and formula work."
            },
            common_mistake: {
              type: Type.STRING,
              description: "A key common mistake or pitfall to avoid when using this query or formula."
            },
            optimization_tip: {
              type: Type.STRING,
              description: "An actionable optimization or best practice tip for performance and scaling."
            }
          },
          required: ["sql_query", "excel_formula", "explanation", "common_mistake", "optimization_tip"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response received from AI model.");
    }

    const parsedJson = JSON.parse(responseText);
    return res.json(parsedJson);

  } catch (error: any) {
    console.error("Error in /api/generate:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate query. Please check your prompt and try again."
    });
  }
});

// 2. Explain Existing Query API
app.post("/api/explain", async (req, res) => {
  try {
    const { query, queryType = 'SQL', dbType = 'PostgreSQL', excelVersion = '365' } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: "Query string is required for explanation." });
    }

    const ai = getGenAIClient();

    const systemInstruction = `You are a Database Engineer and Spreadsheet Auditor.
Your task is to analyze and explain an existing SQL query or Excel formula in detail.

Rules:
1. Provide a high-level summary of what the code does.
2. Break down each clause (SELECT, FROM, WHERE, GROUP BY, HAVING, JOIN, Window Function) or formula component (e.g. INDEX, MATCH, XLOOKUP, SUMIFS, IF, LET) in an array of breakdown items.
3. Highlight performance considerations (e.g., full table scans, Cartesian joins, volatile functions, full column references like A:A).
4. Suggest concrete refactorings or improvements if any exist.`;

    const promptText = `
Type: ${queryType}
${queryType === 'SQL' ? `Database Engine: ${dbType}` : `Excel Version: ${excelVersion}`}

Code to Explain:
\`\`\`
${query}
\`\`\`
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "High-level summary of what this code accomplishes."
            },
            breakdown: {
              type: Type.ARRAY,
              description: "Detailed clause-by-clause or function-by-function breakdown.",
              items: {
                type: Type.OBJECT,
                properties: {
                  part: {
                    type: Type.STRING,
                    description: "The specific clause or formula component (e.g., 'WHERE OrderDate >= ...' or 'XLOOKUP(...)')"
                  },
                  description: {
                    type: Type.STRING,
                    description: "Explanation of what this specific component does."
                  }
                },
                required: ["part", "description"]
              }
            },
            performance_considerations: {
              type: Type.STRING,
              description: "Analysis of efficiency, indexing, calculation chain, or memory impact."
            },
            suggested_improvements: {
              type: Type.STRING,
              description: "Recommended refactorings or modern alternatives."
            }
          },
          required: ["summary", "breakdown", "performance_considerations", "suggested_improvements"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response received from AI model.");
    }

    const parsedJson = JSON.parse(responseText);
    return res.json(parsedJson);

  } catch (error: any) {
    console.error("Error in /api/explain:", error);
    return res.status(500).json({
      error: error?.message || "Failed to explain query. Please try again."
    });
  }
});

// 3. Generate Sample Data API
app.post("/api/sample-data", async (req, res) => {
  try {
    const { schema, rowCount = 10 } = req.body;

    if (!schema || typeof schema !== 'string' || !schema.trim()) {
      return res.status(400).json({ error: "Table schema is required to generate sample data." });
    }

    const ai = getGenAIClient();

    const systemInstruction = `You are a synthetic test data generator.
Given a table schema or list of columns, generate exactly ${Math.min(20, Math.max(1, rowCount))} realistic rows of mock sample data.
Output realistic names, dates, amounts, email addresses, order IDs, and statuses that strictly fit the column names and data types implied by the schema.
Return JSON containing column names array and an array of row objects where keys match column names.`;

    const promptText = `
Table Schema / Columns:
${schema}

Generate ${rowCount} realistic sample rows.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            columns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of column names matching the schema."
            },
            rows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                description: "Map of column name to value for each row."
              },
              description: "List of row objects."
            }
          },
          required: ["columns", "rows"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response received from AI model.");
    }

    const parsedJson = JSON.parse(responseText);
    return res.json(parsedJson);

  } catch (error: any) {
    console.error("Error in /api/sample-data:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate sample data. Please try again."
    });
  }
});

// Serve frontend / Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI SQL & Excel Query Generator Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
