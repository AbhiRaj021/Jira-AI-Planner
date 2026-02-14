
import OpenAI from 'openai';
import { Plan, PlanSchema } from './schema';

const apiKey = process.env.SAMBANOVA_API_KEY;

export async function generatePlan(
    feature: {
        name: string;
        goal: string;
        users: string;
        constraints: string;
        type: string;
        risks?: string;
    }
): Promise<Plan> {

    if (!apiKey) {
        console.warn("Missing SAMBANOVA_API_KEY. Returning mock data.");
        await new Promise(resolve => setTimeout(resolve, 2000));
        return generateMockPlan(feature);
    }

    const client = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.sambanova.ai/v1",
    });

    const prompt = `
    You are an expert Senior software Architect.
    Analyze the following feature request and generate a detailed implementation plan.
    
    Feature Name: ${feature.name}
    Goal: ${feature.goal}
    Target Users: ${feature.users}
    Platform Type: ${feature.type}
    Constraints: ${feature.constraints}
    Known Risks: ${feature.risks || "None provided"}

    Guidelines:
    1. Break down the work into specific, actionable engineering tasks.
    2. Group tasks by Frontend, Backend, and Database.
    3. Include detailed user stories.
    4. Identify technical risks and assumptions.
    5. Be practical and implementation-focused.
    
    Output strictly in the following JSON format. Ensure all strings use double quotes, no trailing commas, and all quotes within strings are escaped.
    
    JSON Template:
    {
      "featureName": "string",
      "goal": "string",
      "userStories": [
          { "title": "string", "acceptanceCriteria": ["string"] }
      ],
      "tasks": {
          "frontend": [ { "title": "string", "description": "string", "type": "frontend", "complexity": "low" | "medium" | "high" } ],
          "backend": [ { "title": "string", "description": "string", "type": "backend", "complexity": "low" | "medium" | "high" } ],
          "database": [ { "title": "string", "description": "string", "type": "database", "complexity": "low" | "medium" | "high" } ]
      },
      "risks": ["string"],
      "assumptions": ["string"]
    }
  `;

    try {
        const response = await client.chat.completions.create({
            model: "Meta-Llama-3.1-8B-Instruct",
            messages: [
                { role: "system", content: "You are a specialized Senior Software Architect. You ONLY output valid JSON. No conversational text, no markdown. Ensure all quotes within JSON strings are escaped as \\\"." },
                { role: "user", content: prompt }
            ],
            temperature: 0.1,
            top_p: 0.1,
            max_tokens: 4000
        });

        const responseText = response.choices[0].message.content || "{}";


        let jsonString = responseText.trim();


        jsonString = jsonString.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');


        const start = jsonString.indexOf('{');
        const end = jsonString.lastIndexOf('}');

        if (start === -1 || end === -1) {
            throw new Error("No JSON object found in response");
        }

        jsonString = jsonString.substring(start, end + 1);


        jsonString = jsonString.replace(/,\s*([\]}])/g, '$1');


        jsonString = jsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");

        try {
            let plan = JSON.parse(jsonString);
            plan = normalizePlan(plan);
            PlanSchema.parse(plan);
            return plan;
        } catch (parseError) {
            console.error("JSON/Schema Error. Raw Response:", responseText);
            console.error("Cleaned Content:", jsonString);
            
            if (parseError instanceof SyntaxError) {
                try {
                    const extraClean = jsonString
                        .replace(/\\'/g, "'")
                        .replace(/\n/g, "\\n")
                        .replace(/\r/g, "\\r");
                    let plan = JSON.parse(extraClean);
                    plan = normalizePlan(plan);
                    PlanSchema.parse(plan);
                    return plan;
                } catch (innerError) {
                    throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
                }
            }

            throw new Error(`AI generated an invalid plan structure: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
        }
    } catch (error) {
        console.error("Error calling SambaNova:", error);
        throw error;
    }
}

function normalizePlan(plan: any): any {
    if (!plan || typeof plan !== 'object') return plan;

    const normalizeTask = (t: any, defaultType: string) => ({
        ...t,
        type: ['frontend', 'backend', 'database'].includes(t.type?.toLowerCase())
            ? t.type.toLowerCase()
            : defaultType,
        complexity: ['low', 'medium', 'high'].includes(t.complexity?.toLowerCase())
            ? t.complexity.toLowerCase()
            : 'medium'
    });

    return {
        ...plan,
        tasks: {
            frontend: (plan.tasks?.frontend || []).map((t: any) => normalizeTask(t, 'frontend')),
            backend: (plan.tasks?.backend || []).map((t: any) => normalizeTask(t, 'backend')),
            database: (plan.tasks?.database || []).map((t: any) => normalizeTask(t, 'database')),
        }
    };
}

function generateMockPlan(feature: any): Plan {
    return {
        featureName: feature.name,
        goal: feature.goal,
        userStories: [
            {
                title: "As a user, I want to see this feature so that I can be happy",
                acceptanceCriteria: ["User can click button", "Page loads"]
            }
        ],
        tasks: {
            frontend: [
                {
                    title: "Create UI Component",
                    description: "Implement the main component using React",
                    type: "frontend",
                    complexity: "medium"
                }
            ],
            backend: [
                {
                    title: "Create API Endpoint",
                    description: "Setup /api/feature route",
                    type: "backend",
                    complexity: "low"
                }
            ],
            database: [
                {
                    title: "Update Schema",
                    description: "Add necessary fields to DB",
                    type: "database",
                    complexity: "low"
                }
            ]
        },
        risks: ["API capability might be limited"],
        assumptions: ["User has valid account"]
    };
}
