const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

import { createClient } from "npm:@supabase/supabase-js@2.39.7";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      'https://yljhyjnysjjmdjgegtlp.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsamh5am55c2pqbWRqZ2VndGxwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDc1MzEzOSwiZXhwIjoyMDYwMzI5MTM5fQ.TwWgqOXmmsVkl_OND0E625AWu-eNo3ymuGm08Bqyn-w'
    );

    // Delete existing user if exists
    const { data: existingUsers } = await supabaseClient.auth.admin.listUsers();
    const userToDelete = existingUsers?.users.find(u => u.email === 'info@aquatutorai.jp');
    if (userToDelete) {
      await supabaseClient.auth.admin.deleteUser(userToDelete.id);
    }

    // Create new admin user
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email: 'info@aquatutorai.jp',
      password: 'Aquatutor001',
      email_confirm: true,
    });

    if (authError) throw authError;

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update profile with admin flag
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        is_admin: true,
        email: 'info@aquatutorai.jp',
        full_name: '管理者',
      })
      .eq('id', authData.user.id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        message: 'Admin user created successfully', 
        userId: authData.user.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating admin:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});