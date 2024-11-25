window.config = {
  // apiBaseUrl: 'localhost:7082', // URL khi chạy local
  apiBaseUrl: 'met20241125025246.azurewebsites.net', // Hoặc URL khi deploy
  jwtToken: localStorage.getItem('jwtToken'),
}
if (!jwtToken) {
  localStorage.removeItem('jwtToken')
  window.location.href = '/login'
} else {
  console.log(jwtToken)
}
