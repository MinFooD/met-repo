async function exportExcel() {
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

const globalFunctions = {
  exportExcel,
}

Object.keys(globalFunctions).forEach((key) => {
  window[key] = globalFunctions[key]
})
