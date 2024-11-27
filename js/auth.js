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
})

// import { initializeOneSignal } from '/js/utils.js'

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
      if (data.userId) {
        localStorage.setItem('userId', data.userId) // Lưu userId vào localStorage
      }
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

  if (!username || !password) {
    alert('Username and password cannot be empty.')
    return
  }

  var account = {
    userName: username,
    password: password,
    roles: roles,
  }

  try {
    // Lấy Player ID từ OneSignal
    const playerId = await OneSignal.getUserId()
    if (playerId) {
      account.playerId = playerId // Thêm Player ID vào thông tin tài khoản
    } else {
      console.log('No Player ID found. Requesting permission...')
      const permission = await OneSignal.getNotificationPermission()
      if (permission === 'default' || permission === 'denied') {
        await OneSignal.showNativePrompt() // Yêu cầu quyền thông báo
      }
    }

    // Sau khi yêu cầu quyền, kiểm tra lại Player ID
    const playerIdAfterPrompt = await OneSignal.getUserId()
    if (playerIdAfterPrompt) {
      account.playerId = playerIdAfterPrompt // Gắn Player ID mới vào thông tin tài khoản
      console.log('Player ID after prompt:', playerIdAfterPrompt)
    }

    // Gọi hàm đăng ký tài khoản
    await Register(account)
  } catch (error) {
    console.error('Error getting playerId from OneSignal:', error)
    // Thông báo lỗi nếu không lấy được playerId
  }
}

async function Register(account) {
  try {
    const response = await fetch(`https://${window.config.apiBaseUrl}/api/Auth/Register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    })

    if (response.ok) {
      const data = await response.json()

      // Kiểm tra nếu có userId trong response từ backend
      const userId = data.userId
      if (userId) {
        localStorage.setItem('userId', userId) // Lưu userId vào localStorage
        console.log('Registration Successful:', data.message)
        alert(data.message)

        // Liên kết external_user_id với OneSignal
        await linkUserToOneSignal(userId)

        // Sau khi đăng ký thành công, chuyển hướng đến trang login
        window.location.href = '/login'
      } else {
        alert('Registration failed. No userId received.')
        console.error('No userId in the response.')
      }
    } else {
      const errorMessage = await response.text()
      alert('Registration failed. Please check your permissions.')
      console.error('Failed to register:', errorMessage)
    }
  } catch (error) {
    alert('Load data failed, please check your connection to the backend.')
    console.error('Error:', error)
  }
}

// Hàm liên kết userId với OneSignal
async function linkUserToOneSignal(userId) {
  try {
    if (typeof OneSignal !== 'undefined' && userId) {
      // Gán external_user_id trong OneSignal
      await OneSignal.setExternalUserId(userId)
      console.log(`Linked userId ${userId} to OneSignal`)
    }
  } catch (error) {
    console.error('Error linking userId to OneSignal:', error)
  }
}

// async function callRegister() {
//   const username = document.getElementById('username').value
//   const password = document.getElementById('password').value
//   const checkbox = document.getElementById('CheckboxLarge')
//   const roles = checkbox.checked ? ['writer'] : ['reader']
//   if (!username || !password) {
//     alert('Username and password cannot be empty.')
//     return
//   }
//   var account = {
//     userName: username,
//     password: password,
//     roles: roles,
//   }
//   try {
//     // Lấy Player ID từ OneSignal
//     const playerId = await OneSignal.getUserId()
//     if (playerId) {
//       account.playerId = playerId // Thêm Player ID vào thông tin tài khoản
//     } else {
//       console.log('No Player ID found. Requesting permission...')
//       const permission = await OneSignal.getNotificationPermission()
//       if (permission === 'default' || permission === 'denied') {
//         await OneSignal.showNativePrompt() // Yêu cầu quyền thông báo
//       }
//     }
//     const playerIdAfterPrompt = await OneSignal.getUserId()
//     if (playerIdAfterPrompt) {
//       account.playerId = playerIdAfterPrompt // Gắn Player ID mới vào thông tin tài khoản
//       console.log('Player ID after prompt:', playerIdAfterPrompt)
//     }
//     await Register(account)
//   } catch (error) {
//     console.error('Error getting playerId from OneSignal:', error)
//     // Bạn có thể thông báo lỗi nếu không lấy được playerId
//   }
// }

// async function Register(account) {
//   try {
//     const response = await fetch(`https://${window.config.apiBaseUrl}/api/Auth/Register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(account),
//     })
//     if (response.ok) {
//       const message = await response.text()
//       console.log('Registration Successful:', message)
//       alert(message)
//       // Sau khi đăng ký thành công, thực hiện khởi tạo OneSignal
//       // await initializeOneSignal(account.userName) // Gửi username làm externalId cho OneSignal

//       window.location.href = '/login'
//     } else {
//       const errorMessage = await response.text()
//       alert('Registration failed. Please check your permissions.')
//       console.error('Failed to register:', errorMessage)
//     }
//   } catch (error) {
//     alert('Load data failed, please check your connection to the backend.')
//     console.error('Error:', error)
//   }
// }

// export async function logout() {
//   // Xóa tất cả dữ liệu trong localStorage
//   localStorage.clear()
//   // Gọi OneSignal.logout() để đăng xuất khỏi OneSignal
//   OneSignal.logout()
//   // Chuyển hướng đến trang login
//   window.location.href = '/login'
//   // Lưu thông báo logout vào localStorage
//   localStorage.setItem('logoutMessage', 'Logout succeeded!')
// }

export async function logout() {
  try {
    // Hủy liên kết tài khoản hiện tại với OneSignal
    await OneSignal.removeExternalUserId()
    console.log('Removed external user ID from OneSignal')
  } catch (error) {
    console.error('Error removing external user ID from OneSignal:', error)
  }

  // Xóa dữ liệu trong localStorage
  localStorage.clear()
  localStorage.setItem('logoutMessage', 'Logout succeeded!')
  window.location.href = '/login'
}

const globalFunctions = {
  Register,
  login,
  callLogin,
  callRegister,
  // initializeOneSignal,
}

Object.keys(globalFunctions).forEach((key) => {
  window[key] = globalFunctions[key]
})
