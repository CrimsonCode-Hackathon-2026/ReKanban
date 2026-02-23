// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";
import { Octokit } from "npm:octokit";

interface respPayload {
  list :
    {
      owner: string,
      repos: string[]
    }[]
}

Deno.serve(async (req: Request) => {
    // corsheaders
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Headers": "authorization,  x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  
  // cors preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try 
  {
    const { github_token} = await req.json();

    if (!github_token) {
      return new Response("No GitHub token", { status: 401, headers: corsHeaders });
    }

    const octokit = new Octokit({
      auth: github_token,
    });

    // Organizations
    const { data: orgs } = await octokit.rest.orgs.listForAuthenticatedUser({
    });

    // Org repos
    const allRepos = await Promise.all(
      orgs.map(async (org) => {
        const { data } = await octokit.rest.repos.listForOrg({
          org: org.login,
        });

        return {
          owner: org.login,
          repos: data.map(repo => repo.name)
        };
      })
    );

    // 1. User
    const { data: user } = await octokit.rest.users.getAuthenticated();

    // 2. Personal repos
    const { data: userRepos } = await octokit.rest.repos.listForAuthenticatedUser({
      affiliation: "owner",
    });

    allRepos.push(
      { owner: user.login, 
        repos: userRepos.map(repo => repo.name), });

    const responsePayload: respPayload = {
      list: allRepos,
    };


  return new Response( JSON.stringify(responsePayload),
    { headers: { 'Content-Type': 'application/json', 'Connection': 'keep-alive', ...corsHeaders }}
  );
  } catch(error) {
    return new Response(
    JSON.stringify({error: error.message}),
    { headers: { 'Content-Type': 'application/json', 'Connection': 'keep-alive', ...corsHeaders }}
    );
  }
});