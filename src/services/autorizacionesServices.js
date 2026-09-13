// Genera un hash SHA-256 de un string usando la Web Crypto API del navegador.
const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

const usuarios = [
  {
    email: 'antonella@gmail.com',
    passwordHash: '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2',
    nombre: 'Antonella',
    sector: 'Soporte'
  },
  {
    email: 'jimena@gmail.com',
    passwordHash: '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2',
    nombre: 'Jimena',
    sector: 'Gerencia'
  },
  {
    email: 'maia@gmail.com',
    passwordHash: '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2',
    nombre: 'Maia',
    sector: 'Gerencia'
  },
  {
    email: 'abril@gmail.com',
    passwordHash: '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2',
    nombre: 'Abril',
    sector: 'Soporte'
  },
  {
    email: 'guadalupe@gmail.com',
    passwordHash: '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2',
    nombre: 'Guadalupe',
    sector: 'Soporte'
  },
  {
    email: 'lourdes@gmail.com',
    passwordHash: '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2',
    nombre: 'Lourdes',
    sector: 'Gerencia'
  }
]

const login = async (email, password, sector) => {
  const passwordHash = await hashPassword(password)
  return usuarios.find(
    usuario =>
      usuario.email === email &&
      usuario.passwordHash === passwordHash &&
      usuario.sector === sector
  )
}

export default {
  login
}