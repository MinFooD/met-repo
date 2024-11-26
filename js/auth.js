document.addEventListener('DOMContentLoaded', () => {
  // Hiển thị thông báo nếu có trong localStorage
  const logoutMessage = localStorage.getItem('logoutMessage')
  if (logoutMessage) {
    alert(logoutMessage)
    localStorage.removeItem('logoutMessage')
  }

  // Cập nhật nhãn checkbox dựa trên trạng thái
  const checkbox = document.getElementById('CheckboxLarge')
  const label = document.getElementById('checkboxLabel')

  function updateLabel() {
    const currentLabel = checkbox.checked ? 'Writer' : 'Reader'
    if (label.textContent !== currentLabel) {
      label.textContent = currentLabel
    }
  }
  if (checkbox != null) {
    // Lắng nghe sự kiện thay đổi của checkbox
    checkbox.addEventListener('change', updateLabel)

    // Thiết lập nhãn ban đầu khi trang tải
    updateLabel()
  }
  if (!window.OneSignal) {
    console.error('OneSignal chưa được tải. Vui lòng kiểm tra.')
  }
})

import { initializeOneSignal } from '/js/utils.js'

async function callLogin() {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  const user = {
    username: username,
    password: password,
  }
  console.log(window.config.apiBaseUrl)

  await login(user)
}

async function login(user) {
  try {
    const response = await fetch(`https://${window.config.apiBaseUrl}/api/Auth/Login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })

    const data = await response.json()
    if (data.userName) {
      localStorage.setItem('loginName', data.userName)
    }
    if (data.jwtToken) {
      localStorage.setItem('jwtToken', data.jwtToken)
      window.location.href = '/'
    } else {
      console.log('No Token! Please check.')
      document.getElementById('errorMessage').textContent = 'Token Failed'
    }
  } catch (error) {
    console.error('Error:', error)
    document.getElementById('errorMessage').textContent = 'Login failed!'
  }
}

async function callRegister() {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const checkbox = document.getElementById('CheckboxLarge')
  const roles = checkbox.checked ? ['writer'] : ['reader']

  console.log('Username:', username)
  console.log('Password:', password)
  console.log('Roles:', roles)

  if (!username || !password) {
    alert('Username and password cannot be empty.')
    return
  }
  var account = {
    userName: username,
    password: password,
    roles: roles,
  }
  Register(account, username)
}

async function Register(account, externalId) {
  try {
    const response = await fetch(`https://${window.config.apiBaseUrl}/api/Auth/Register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    })

    if (response.ok) {
      const message = await response.text()
      console.log('Registration Successful:', message)

      alert(message)
      try {
        await initializeOneSignal(externalId)
      } catch (error) {
        console.warn('Failed to initialize OneSignal:', error)
      }
      window.location.href = '/login'
    } else {
      const errorMessage = await response.text()
      alert('Registration failed. Please check your permissions.')
      console.error('Failed to register:', response.status, errorMessage)
    }
  } catch (error) {
    alert('Load data failed, please check your connection to the backend.')
    console.error('Error:', error)
  }
}

export async function logout() {
  // Xóa JWT khỏi localStorage và chuyển hướng
  localStorage.removeItem('jwtToken')
  window.location.href = '/login'
  localStorage.setItem('logoutMessage', 'Logout succeeded!')
}

const globalFunctions = {
  Register,
  login,
  callLogin,
  callRegister,
  initializeOneSignal,
}

Object.keys(globalFunctions).forEach((key) => {
  window[key] = globalFunctions[key]
})
