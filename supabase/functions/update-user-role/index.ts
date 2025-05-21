import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface UpdateUserRoleRequest {
  userId: string;
  uiRole: 'admin' | 'editor' | 'viewer';
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
      return new Response(JSON.stringify({ error: 'Acesso negado. Apenas administradores podem atualizar papéis de usuários.' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Obter os dados da requisição
    const { userId, uiRole } = await req.json() as UpdateUserRoleRequest

    // Validar os dados
    if (!userId || !uiRole) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Verificar quais são os valores válidos para o enum user_role no banco de dados
    const { data: enumData, error: enumError } = await supabaseAdmin
      .from('pg_enum')
      .select('enumlabel')
      .eq('enumtypid', 'user_role')
    
    if (enumError) {
      console.error('Erro ao verificar enum:', enumError)
      return new Response(JSON.stringify({ error: `Erro ao verificar valores válidos para o papel: ${enumError.message}` }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
    
    // Obter os valores permitidos para o papel
    const allowedRoles = enumData?.map(item => item.enumlabel) || []
    console.log('Papéis permitidos:', allowedRoles)
    
    // Mapear o papel da UI para o valor do banco de dados
    let dbRole: string
    if (uiRole === 'admin' && allowedRoles.includes('admin')) {
      dbRole = 'admin'
    } else if (uiRole === 'editor') {
      // Para editor, verificar se 'user' é um valor válido, caso contrário usar 'viewer'
      dbRole = allowedRoles.includes('user') ? 'user' : 'viewer'
    } else {
      dbRole = 'viewer'
    }
    
    console.log('Papel mapeado para:', dbRole)
    
    // Atualizar o papel do usuário
    const { error: updateError } = await supabaseAdmin
      .from('user_roles')
      .update({ role: dbRole })
      .eq('user_id', userId)
    
    if (updateError) {
      return new Response(JSON.stringify({ error: `Erro ao atualizar papel: ${updateError.message}` }), {
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
      message: 'Papel atualizado com sucesso',
      role: dbRole
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
