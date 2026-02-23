// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";
import { Octokit } from "npm:octokit";


type TaskCreationPayload = {
  projectTitle: string,
  goals: {title: string, success: string}[]
  constraints: string[],
  context: string
  guardrails: { 
    security: string[],
    standards: string[],
    ethics: string[],
    product_principles: string[]
    other: string
  }
}

type GithubIssue = {
  title : string | number, // number must be int
  body : string,
  assignee : string | null,
  milestone: null | string | number // number must be int
  labels: string[]
}

type ReqPayload = {
  github_token: string;
  owner: string;
  repo: string;
  payload: TaskCreationPayload;
}


Deno.serve(async (req: Request) => {
  
  // corsheaders
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // cors preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const { github_token, owner, repo, payload }: ReqPayload = await req.json();


  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  try {
    
    // task generation edge function
    const serviceSupabase = await createClient(supabaseUrl, supabaseKey, {});
    const { data: generated_tasks, error } = await serviceSupabase.functions.invoke('generate-tasks', {
      body: payload,
    });
    if(error) { throw new Error(`something went wrong during generation ${error}`); }
    const taskgenerationResp : { tasks: GithubIssue[] } | null = generated_tasks;
    if(taskgenerationResp == null) { throw new Error("no tasks were generated"); }

    // populate issues on github with tasks 
    const octokit = new Octokit({
      auth: github_token
    });
    for (const task of taskgenerationResp.tasks)
    {
      await octokit.request('POST /repos/{owner}/{repo}/issues', {
        owner: owner,
        repo: repo,
        title: task.title ?? "",
        body: task.body ?? "",
        labels: task.labels ?? [],
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
    }

    return new Response(
      JSON.stringify({issues_link: `https://github.com/${owner}/${repo}/issues`}),
      { headers: { 'Content-Type': 'application/json', 'Connection': 'keep-alive', ...corsHeaders }}
    );

  }
  catch(error) {

    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500 
    });
    
  }
});