async function exportExcel() {
    try {
        // Gửi yêu cầu để lấy file từ API
        const response = await fetch(`https://${window.config.apiBaseUrl}/api/Export`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });
        if (!response.ok) {
            alert('response is not ok!');
            document.getElementById('errorMessage').textContent = "B\u1EA1n kh\xf4ng c\xf3 quy\u1EC1n d\xf9ng ch\u1EE9c n\u0103ng n\xe0y";
            throw new Error("Kh\xf4ng th\u1EC3 th\u1EF1c hi\u1EC7n y\xeau c\u1EA7u xu\u1EA5t d\u1EEF li\u1EC7u.");
        }
        // Nhận file dưới dạng blob
        const blob = await response.blob();
        // Tạo URL từ blob và xử lý tải file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ExcelDemo.xlsx' // Tên file tải về
        ;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url) // Giải phóng URL
        ;
        // Sau khi tải file xong, chuyển hướng về trang khác
        window.location.href = '/';
    } catch (error) {
        console.error("C\xf3 l\u1ED7i x\u1EA3y ra:", error.message);
    }
}

//# sourceMappingURL=index.614cc029.js.map
