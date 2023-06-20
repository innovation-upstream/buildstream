export const authenticate = async (address: string, message: string) => {
  const response = await fetch(`/api/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ address, message })
  })
  const data = await response.json()
  return data
}

export const initiate = async (address: string) => {
  const response = await fetch(`/api/authenticate/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ address })
  })
  const data = await response.json()
  return data
}

export const verify = async (address: string) => {
  const response = await fetch(`/api/authenticate/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ address })
  })
  const data = await response.json()
  return data
}
