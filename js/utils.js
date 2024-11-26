export async function initializeOneSignal(externalId) {
  if (window.OneSignal) {
    try {
      await OneSignal.init({
        appId: '523487ee-5286-415a-8973-77cbd85d83bb', // App ID của OneSignal
        serviceWorkerPath: '/OneSignalSDKWorker.js', // Đảm bảo bạn đã có file này
        promptOptions: {
          slidedown: {
            enabled: true, // Hiển thị thông báo yêu cầu nhận thông báo
          },
        },
      })
      console.log('OneSignal initialized successfully.')
      await OneSignal.setExternalUserId(externalId) // Gán External ID cho người dùng mới
      console.log('Assigned external user ID:', externalId)
      // Hiển thị prompt yêu cầu người dùng đăng ký nhận thông báo
      await OneSignal.showSlidedownPrompt()
      console.log('Displayed subscription prompt.')
      // Lắng nghe thay đổi trạng thái đăng ký nhận thông báo
      OneSignal.on('subscriptionChange', function (isSubscribed) {
        if (isSubscribed) {
          // Lấy Player ID khi người dùng đồng ý nhận thông báo
          OneSignal.getUserId().then(function (playerId) {
            console.log('Player ID:', playerId)
          })
        }
      })
    } catch (error) {
      console.error('Failed to initialize OneSignal:', error)
    }
  } else {
    console.error('OneSignal SDK chưa được tải.')
  }
}
