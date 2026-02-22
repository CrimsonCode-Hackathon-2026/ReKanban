import { createClient } from "@supabase/supabase-js"


const SupabaseClient = createClient(
    "https://chjcowhyqhqinkrbbsck.supabase.co",
    "sb_publishable_9MlKCxVTT7Wic-9y-5W6Tw_cTKVcz5F"
);

export async function login() {
    await SupabaseClient.auth.signInWithOAuth({
    provider: "github",
    options: { 
        redirectTo: window.location.origin,
        scopes: 'repo read:org'
     },
    });
}

export async function logout() {
    await SupabaseClient.auth.signOut();
}

type Repos = {
    owner: string;
    repos: string[];
}[];

export async function isLoggedIn() : Promise<boolean> {
    const { data, error: errorSession } = await SupabaseClient.auth.getSession();
    return !( data.session == null || errorSession ); 
}

export async function getRepos() : Promise<Repos> {
    const { data, error: errorSession } = await SupabaseClient.auth.getSession();
    if ( data.session == null || errorSession ) { throw new Error(errorSession?.message) }
    const github_token = data.session.provider_token;

    const { data: func_data, error: error } = await SupabaseClient.functions.invoke('retrieve-repos', { body: {github_token}  });
    if ( error ) { throw new Error(error.message) }

    return func_data.list;
}

export async function generatedTasks(owner: string, repo: string, payload : any) {
    const { data, error: errorSession } = await SupabaseClient.auth.getSession();
    if ( data.session == null || errorSession ) { throw new Error(errorSession?.message) }
    const github_token = data.session.provider_token;


    const { data: func_data, error } = await SupabaseClient.functions.invoke('create-github-issues', {
        body: { github_token, owner, repo, payload },
    });
    if ( error ) { throw new Error(error.message) }

    return;
}