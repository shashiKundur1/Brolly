import config from './config.js'

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.MESH_API_KEY}`
  }
}

export async function meshChat(body) {
  const res = await fetch(`${config.MESH_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ...body, stream: false })
  })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}

export async function meshChatStream(body) {
  const res = await fetch(`${config.MESH_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ...body, stream: true })
  })
  return res
}

export async function meshModels() {
  const res = await fetch(`${config.MESH_BASE_URL}/models`, {
    method: 'GET',
    headers: headers()
  })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}
