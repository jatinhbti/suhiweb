/**
 * SUHI — SCOREMAX Universal HEX Identifier
 * 96-bit identity: 8-bit World | 8-bit Type | 80-bit Identity
 *
 * Identity is absolute. Everything else is mutable state.
 */

export const TYPE_MAP = {
  '01': 'PERSON',
  '02': 'COMPANY',
  '03': 'PLACE',
  // MetaTypes (0xAA+)
  'AA': 'SYSTEM',
  'AB': 'MODEL',
  'AC': 'SCORE',
  'AD': 'SIMULATION',
  'AE': 'EVENT',
  'AF': 'RELATIONSHIP_CLASS',
}

export const TYPE_LABELS = {
  '01': { name: 'PERSON', description: 'Human entity' },
  '02': { name: 'COMPANY', description: 'Organizational entity' },
  '03': { name: 'PLACE', description: 'Spatial entity' },
  'AA': { name: 'SYSTEM', description: 'System-level meta entity' },
  'AB': { name: 'MODEL', description: 'Computational model' },
  'AC': { name: 'SCORE', description: 'Scoring layer' },
  'AD': { name: 'SIMULATION', description: 'Simulation instance' },
  'AE': { name: 'EVENT', description: 'Temporal event' },
  'AF': { name: 'RELATIONSHIP_CLASS', description: 'Relationship definition' },
}

export const WORLD_MAP = {
  '01': 'EARTH2',
}

export const PRIMARY_TYPES = ['01', '02', '03']
export const META_TYPES = ['AA', 'AB', 'AC', 'AD', 'AE', 'AF']

export function generateSUHI(type = '01') {
  const world = '01'
  let identity = ''

  for (let i = 0; i < 20; i++) {
    identity += Math.floor(Math.random() * 16).toString(16)
  }

  return `0x${world}${type}${identity}`.toUpperCase()
}

export function decodeSUHI(suhi) {
  const hex = suhi.replace('0x', '').replace('0X', '')

  const worldCode = hex.slice(0, 2).toUpperCase()
  const typeCode = hex.slice(2, 4).toUpperCase()
  const identity = hex.slice(4).toUpperCase()

  const isMetaType = META_TYPES.includes(typeCode)

  return {
    world: WORLD_MAP[worldCode] || `WORLD_${worldCode}`,
    worldCode,
    type: TYPE_MAP[typeCode] || `TYPE_${typeCode}`,
    typeCode,
    identity,
    isMetaType,
    full: `0x${hex.toUpperCase()}`,
    label: TYPE_LABELS[typeCode] || { name: `TYPE_${typeCode}`, description: 'Unknown type' },
    segments: {
      world: worldCode,
      type: typeCode,
      identity,
    },
  }
}

export function getRandomType() {
  const types = ['01', '02', '03']
  return types[Math.floor(Math.random() * types.length)]
}

/**
 * Core Rules (Non-Negotiable):
 * - IDs NEVER include place, time, role, company, or metadata
 * - IDs NEVER change after minting
 * - Identity is existence, not information
 * - All context lives in state and relationships
 * - HEX is mandatory for trillion+ scale
 *
 * MetaType Rules:
 * - MetaTypes exist in EARTH2 but do not represent physical actors
 * - MetaTypes can reference PERSON, COMPANY, or PLACE via relationships
 * - MetaTypes NEVER replace core entities
 * - MetaTypes enable: Simulations, Scoring layers, World rules, Physics engines, Governance logic
 *
 * PLACE Rules:
 * - PLACE is an entity, but NEVER embedded into other IDs
 * - PLACE identity is immutable
 * - Coordinates, boundaries, usage, and semantics are STATE
 * - PLACE can represent: Offices, Buildings, Warehouses, Regions, Virtual or abstract locations
 */
