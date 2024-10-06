const storeInsession = (key, value) => {
  return  sessionStorage.setItem(key, value)
}

const retrieveFromSession = (key) => {
    return sessionStorage.getItem(key)
}

const removeFromSession = (key) => {
   return sessionStorage.removeItem(key)
}

const logOut = () => {
  return  sessionStorage.removeItem()
    
}

export { storeInsession, retrieveFromSession, removeFromSession,
    logOut
 }