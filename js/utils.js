export async function initializeOneSignal(externalId) {
  try {
    // Khởi tạo OneSignal
    await OneSignal.init({
      appId: '523487ee-5286-415a-8973-77cbd85d83bb',
      serviceWorkerPath: '/OneSignalSDKWorker.js',
      promptOptions: {
        slidedown: {
          enabled: true, // Cho phép hiển thị yêu cầu thông báo
        },
      },
    })

    // Gán external_id cho người dùng
    await OneSignal.setExternalUserId(externalId)
    console.log('external_id đã được gán:', externalId)

    // Hiển thị yêu cầu thông báo
    await OneSignal.showSlidedownPrompt()
    console.log('Yêu cầu thông báo đã hiển thị.')
  } catch (error) {
    console.error('Lỗi khi khởi tạo hoặc hiển thị thông báo:', error)
  }
}
