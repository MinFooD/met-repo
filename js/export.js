import { jwtToken, updateJwtToken } from '/js/script.js'

export async function exportExcel() {
  updateJwtToken() // Cập nhật `jwtToken` trước khi sử dụng

  if (!jwtToken) {
    alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để sử dụng chức năng này.')
    window.location.href = '/login'
    return
  }
  try {
    // Gửi yêu cầu để lấy file từ API
    const response = await fetch(`https://${window.config.apiBaseUrl}/api/Export`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`, // Đặt token vào header
      },
    })
    if (!response.ok) {
      alert('response is not ok!')
      document.getElementById('errorMessage').textContent = 'Bạn không có quyền dùng chức năng này'
      throw new Error('Không thể thực hiện yêu cầu xuất dữ liệu.')
    }
    // Nhận file dưới dạng blob
    const blob = await response.blob()
    // Tạo URL từ blob và xử lý tải file
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ExcelDemo.xlsx' // Tên file tải về
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url) // Giải phóng URL
    // Sau khi tải file xong, chuyển hướng về trang khác
    window.location.href = '/'
  } catch (error) {
    console.error('Có lỗi xảy ra:', error.message)
  }
}
