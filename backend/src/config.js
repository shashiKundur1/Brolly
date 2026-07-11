const MESH_API_KEY = process.env.MESH_API_KEY || ''
const MESH_BASE_URL = process.env.MESH_BASE_URL || 'https://api.meshapi.ai/v1'
const PORT = Number(process.env.PORT) || 4000
const MOCK = process.env.MOCK !== undefined ? process.env.MOCK === '1' : !MESH_API_KEY
const MONGO_URL = process.env.MONGO_URL || ''
const DEGRADE_ON_SPEND_LIMIT = process.env.DEGRADE_ON_SPEND_LIMIT !== '0'

export default { MESH_API_KEY, MESH_BASE_URL, PORT, MOCK, MONGO_URL, DEGRADE_ON_SPEND_LIMIT }
