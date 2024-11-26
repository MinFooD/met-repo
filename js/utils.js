async function initializeOneSignal(externalId) {
  if (window.OneSignal) {
    try {
      await OneSignal.init({
        appId: '523487ee-5286-415a-8973-77cbd85d83bb',
        serviceWorkerPath: '/OneSignalSDKWorker.js', // Đường dẫn tới service worker
        promptOptions: {
          slidedown: {
            enabled: true,
          },
        },
      })

      console.log('OneSignal initialized successfully.')
      await OneSignal.setExternalUserId(externalId)
      console.log('Assigned external user ID:', externalId)

      await OneSignal.showSlidedownPrompt()
      console.log('Displayed subscription prompt.')
    } catch (error) {
      console.error('Failed to initialize OneSignal:', error)
    }
  } else {
    console.error('OneSignal SDK chưa được tải.')
  }
}
