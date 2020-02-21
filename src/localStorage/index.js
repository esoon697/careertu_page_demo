// const STORAGE_KEY = 'userinfo'
export default{
  get (key, type = 'localStorage') {
    if (type === 'localStorage') {
      return JSON.parse(window.localStorage.getItem(key) || '[]')
    } else if (type === 'sessionStorage') {
      return JSON.parse(window.sessionStorage.getItem(key) || '[]')
    } else {
      alert('type error')
    }
  },
  save (key, value, type = 'localStorage') {
    if (type === 'localStorage') {
      window.localStorage.setItem(key, JSON.stringify(value))
    } else if (type === 'sessionStorage') {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    }
  }
}
