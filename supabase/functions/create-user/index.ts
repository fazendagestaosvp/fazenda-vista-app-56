import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'editor' | 'viewer';
}

serve(async (req) => {
  // Verificar se é uma requisição OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    // Criar um cliente Supabase com a chave de serviço
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Verificar se a requisição é do tipo POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método não permitido' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Obter o token de autenticação do cabeçalho
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Verificar se o usuário está autenticado e é um administrador
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Verificar se o usuário é um administrador
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleError || !roleData || roleData.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Acesso negado. Apenas administradores podem criar usuários.' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Obter os dados da requisição
    const { email, password, fullName, role } = await req.json() as CreateUserRequest

    // Validar os dados
    if (!email || !password || !fullName || !role) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // 1. Criar o usuário no Auth do Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const newUserId = authData.user.id

    // 2. Criar o perfil do usuário
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        { id: newUserId, full_name: fullName }
      ])

    if (profileError) {
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // 3. Definir o papel do usuário
    // Converter o papel da UI para o valor armazenado no banco de dados
    // Verificar qual valor o banco de dados aceita para o papel
    let dbRole: string = "viewer"
    if (role === "admin") dbRole = "admin"
    else if (role === "editor") dbRole = "user" // No banco, "editor" é armazenado como "user"
    else if (role === "viewer") dbRole = "viewer"
    
    // Verificar se o papel é válido consultando os valores permitidos no enum
    const { data: enumData, error: enumError } = await supabaseAdmin
      .from('pg_enum')
      .select('enumlabel')
      .eq('enumtypid', 'user_role')
    
    if (enumError) {
      return new Response(JSON.stringify({ error: `Erro ao verificar enum: ${enumError.message}` }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
    
    // Verificar se o papel mapeado está nos valores permitidos
    const allowedRoles = enumData?.map(item => item.enumlabel) || []
    console.log('Papéis permitidos:', allowedRoles)
    console.log('Papel mapeado:', dbRole)
    
    // Se o papel mapeado não estiver nos valores permitidos, usar um valor padrão seguro
    if (!allowedRoles.includes(dbRole)) {
      if (allowedRoles.includes('viewer')) {
        dbRole = 'viewer'
      } else if (allowedRoles.length > 0) {
        dbRole = allowedRoles[0]
      } else {
        return new Response(JSON.stringify({ error: 'Não foi possível determinar um papel válido' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        })
      }
    }
    
    const { error: roleInsertError } = await supabaseAdmin
      .from('user_roles')
      .insert([
        { user_id: newUserId, role: dbRole }
      ])

    if (roleInsertError) {
      return new Response(JSON.stringify({ error: roleInsertError.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Retornar sucesso
    return new Response(JSON.stringify({ 
      success: true, 
      user: { 
        id: newUserId, 
        email, 
        fullName, 
        role 
      } 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
})
