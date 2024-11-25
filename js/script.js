// document.addEventListener('DOMContentLoaded', getAllWalks)
let pageNumber = 1
const pageSize = 5

export let jwtToken = localStorage.getItem('jwtToken')

export function validateJwtToken() {
  if (!jwtToken) {
    localStorage.removeItem('jwtToken')
    window.location.href = '/login'
  } else {
    console.log(jwtToken)
  }
}

validateJwtToken()

if (localStorage.getItem('loginName')) {
  document.getElementById('loginName').textContent = `Hello ${localStorage.getItem('loginName')}`
}

async function applyFilter() {
  // Lấy giá trị từ form
  const filterOn = document.getElementById('filterOn').value
  const filterQuery = document.getElementById('filterQuery').value
  const sortBy = document.getElementById('sortBy').value
  const isAscending = document.getElementById('isAscending').value
  // Gọi getAllWalks với các tham số filter
  getAllWalks(filterOn, filterQuery, sortBy, isAscending)
}
async function changePage(change) {
  pageNumber += change
  if (pageNumber < 1) pageNumber = 1 // Đảm bảo không dưới trang 1
  applyFilter()
}
async function getAllWalks(filterOn = null, filterQuery = null, sortBy = null, isAscending = null) {
  document.getElementById('errorMessage').textContent = ''
  let url = `https://${window.config.apiBaseUrl}/api/Walks/GetAll`
  const params = []

  params.push(`pageNumber=${encodeURIComponent(pageNumber)}`)
  params.push(`pageSize=${encodeURIComponent(pageSize)}`)

  if (filterOn && filterQuery) {
    params.push(`filterOn=${encodeURIComponent(filterOn)}`)
    params.push(`filterQuery=${encodeURIComponent(filterQuery)}`)
  }

  if (sortBy) {
    params.push(`sortBy=${encodeURIComponent(sortBy)}`)
    params.push(`isAscending=${encodeURIComponent(isAscending)}`)
  }

  if (params.length > 0) {
    url += '?' + params.join('&')
  }

  console.log(url)

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwtToken}`, // Đặt token vào header
      },
    })

    if (response.ok) {
      const data = await response.json() // Chuyển đổi phản hồi sang JSON
      console.log('Fetched All Walks:', data) // Log kết quả
      displayResult(data) // Gọi hàm hiển thị kết quả
    } else {
      document.getElementById('errorMessage').textContent = 'Bạn không có quyền dùng chức năng này'
      alert('Response is not ok, please check fetchAllWalks')
      console.error('Failed to fetch walks:', response.status)
    }
  } catch (error) {
    alert('Failed to load data, please check your connection with the backend')
    console.error('Error fetching walks:', error)
  }
}

//hiển thị form AddWalk
async function toggleAddWalkForm() {
  // Lấy phần tử addWalkForm
  const addWalkForm = document.getElementById('addWalkForm')
  // Hiển thị hoặc ẩn form khi nhấn nút Add
  if (addWalkForm.style.display === 'none' || addWalkForm.style.display === '') {
    addWalkForm.style.display = 'block' // Hiển thị form
  } else {
    addWalkForm.style.display = 'none' // Ẩn form
  }
}
//lấy data từ input rồi truyền vào gọi về API , add
async function callCreateWalk() {
  const name = document.getElementById('walkName').value
  const description = document.getElementById('walkDescription').value
  const length = parseFloat(document.getElementById('walkLength').value)
  const imageUrl = document.getElementById('walkImageUrl').value
  const difficultyId = document.getElementById('difficultyId').value
  const regionId = document.getElementById('regionId').value

  const newWalk = {
    name: name,
    description: description,
    lengthInKm: length,
    walkImageUrl: imageUrl,
    difficultyId: difficultyId,
    regionId: regionId,
  }
  createWalk(newWalk)
}
//gọi API, add new walk
async function createWalk(walkData) {
  try {
    const response = await fetch(`https://${window.config.apiBaseUrl}/api/Walks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtToken}` },
      body: JSON.stringify(walkData), // Dữ liệu Walk mới từ đối tượng `walkData`
    })
    if (response.ok) {
      const createdWalk = await response.json()
      console.log('Created Walk:', createdWalk)
      toggleAddWalkForm()
      getWalkById(createdWalk.id) // Hiển thị kết quả
    } else {
      document.getElementById('errorMessage').textContent = 'Bạn không có quyền dùng chức năng này'
      alert('response is not oke, check createWalk')
      console.error('Failed to create walk:', response.status)
    }
  } catch (error) {
    alert('Load data failed, pls connection with your BE')
    console.error('Error:', error)
  }
}

//lấy data từ input rồi truyền vào gọi về API, get single
async function callGetWalkById() {
  const walkId = document.getElementById('walkId').value.trim()
  if (walkId === null) {
    alert('You forgot to input the WalkId!!!')
    return
  }
  getWalkById(walkId)
}
//gọi API, get single walk by id
async function getWalkById(walkId) {
  try {
    const response = await fetch(`https://${window.config.apiBaseUrl}/api/Walks/${walkId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${jwtToken}` },
    })

    if (response.ok) {
      const walk = await response.json()
      console.log('Fetched Walk by ID:', walk)
      displayResult([walk]) // Hiển thị kết quả
    } else {
      document.getElementById('errorMessage').textContent = 'Bạn không có quyền dùng chức năng này'
      console.error('Walk not found:', response.status)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

//lấy data rồi bỏ vào form Update xong hiện form ra
async function showUpdateForm(walk) {
  const form = document.getElementById('updateForm')
  form.style.display = 'block' // Hiển thị form cập nhật

  // Điền dữ liệu hiện tại của walk vào form
  document.getElementById('updateWalkName').value = walk.name
  document.getElementById('updateDescription').value = walk.description
  // document.getElementById('updateLength').value = walk.lengthInKm
  document.getElementById('updateLength').value = String(walk.lengthInKm).replace(',', '.')
  document.getElementById('updateImageUrl').value = walk.walkImageUrl
  document.getElementById('updateDifficultyId').value = walk.difficulty.id
  document.getElementById('updateRegionId').value = walk.region.id

  // Lưu id của walk vào form để gửi khi cập nhật
  document.getElementById('updateForm').dataset.walkId = walk.id
}
//lấy data đã được thay đổi rồi truyền vào gọi về API , update
async function submitUpdatedWalk() {
  const walkId = document.getElementById('updateForm').dataset.walkId // Lấy id của walk
  if (!walkId) {
    alert('Invalid Walk ID')
    return
  }
  const updatedData = {
    name: document.getElementById('updateWalkName').value,
    description: document.getElementById('updateDescription').value,
    lengthInKm: parseFloat(document.getElementById('updateLength').value),
    walkImageUrl: document.getElementById('updateImageUrl').value,
    difficultyId: document.getElementById('updateDifficultyId').value,
    regionId: document.getElementById('updateRegionId').value,
  }
  updateWalk(walkId, updatedData)
}
//gọi API, update
async function updateWalk(id, updatedData) {
  try {
    const response = await fetch(`https://${window.config.apiBaseUrl}/api/Walks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(updatedData),
    })
    if (!response.ok) {
      alert('Update failed - response not ok')
      document.getElementById('errorMessage').textContent = 'Bạn không có quyền dùng chức năng này'
      throw new Error('Failed to update walk')
    }
    const updatedWalk = await response.json()
    console.log('Updated Walk:', updatedWalk)
    document.getElementById('updateForm').style.display = 'none'
    // Làm mới danh sách walks sau khi cập nhật
    getAllWalks()
  } catch (error) {
    console.error('Error updating walk:', error)
  }
}
//cancel
async function cancelUpdate() {
  document.getElementById('updateForm').style.display = 'none'
}

//lấy id rồi xin xác nhận, yes => gọi APi, delete
async function deleteWalk(walkId) {
  const isConfirmed = window.confirm('Are you sure you want to delete this walk?')
  if (!isConfirmed) {
    console.log('Delete action was canceled')
    return
  }
  try {
    const response = await fetch(`https://${window.config.apiBaseUrl}/api/Walks/${walkId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwtToken}` },
    })

    if (response.ok) {
      console.log('Deleted Walk with ID:', walkId)
      alert('Walk deleted successfully')
      getAllWalks() // Xóa kết quả trên giao diện hoặc thông báo xóa thành công
    } else {
      document.getElementById('errorMessage').textContent = 'Bạn không có quyền dùng chức năng này'
      alert('Failed to delete walk')
      console.error('Failed to delete walk:', response.status)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

//hiển thị div chứa danh sách walk, số lượng thì tùy lúc gọi hàm này
function displayResult(walks) {
  const resultDiv = document.getElementById('result')
  resultDiv.innerHTML = '' // Xóa nội dung cũ

  const table = document.createElement('table')
  table.innerHTML = `
    <tr>
      <th>Walk Name</th>
      <th>Description</th>
      <th>Length (km)</th>
      <th>Image URL</th>
      <th>Region Code</th>
      <th>Difficulty Name</th>
      <th>Action</th>
    </tr>
  `
  walks.forEach((walk) => {
    // Tạo một phần tử div cho mỗi walk
    const row = document.createElement('tr')

    // Hiển thị các thông tin của walk
    row.innerHTML = `
      <td>${walk.name}</td>
      <td>${walk.description}</td>
      <td>${walk.lengthInKm}</td>
      <td>${walk.walkImageUrl}</td>
      <td>${walk.region.code}</td>
      <td>${walk.difficulty.name}</td>
    `
    // Tạo cột Action và thêm nút Update vào hàng
    const actionCell = document.createElement('td')
    const updateButton = document.createElement('button')
    const deleteButton = document.createElement('button')
    updateButton.textContent = 'Update'
    deleteButton.textContent = 'Delete'

    updateButton.onclick = () => showUpdateForm(walk)
    deleteButton.onclick = () => deleteWalk(walk.id)

    actionCell.appendChild(updateButton)
    actionCell.appendChild(deleteButton)
    row.appendChild(actionCell)
    table.appendChild(row)
  })
  // Tạo thẻ div chứa các nút Previous và Next
  const paginationDiv = document.createElement('div')
  paginationDiv.style.marginTop = '10px' // Thêm khoảng cách giữa bảng và các nút

  // Tạo nút Previous
  const previousBtn = document.createElement('button')
  previousBtn.id = 'previousBtn'
  previousBtn.textContent = 'Previous'
  previousBtn.onclick = () => changePage(-1)

  // Tạo nút Next
  const nextBtn = document.createElement('button')
  nextBtn.id = 'nextBtn'
  nextBtn.textContent = 'Next'
  nextBtn.onclick = () => changePage(1)

  paginationDiv.appendChild(previousBtn)
  paginationDiv.appendChild(nextBtn)
  // Thêm bảng vào `resultDiv`
  resultDiv.appendChild(table)
  resultDiv.appendChild(paginationDiv)
}

async function logout() {
  // Xóa JWT khỏi localStorage và chuyển hướng
  localStorage.removeItem('jwtToken')
  window.location.href = '/login'
  localStorage.setItem('logoutMessage', 'Logout succeeded!')
}

import { exportExcel } from '/js/export.js'

const globalFunctions = {
  pageNumber,
  pageSize,
  applyFilter,
  changePage,
  getAllWalks,
  toggleAddWalkForm,
  callCreateWalk,
  createWalk,
  callGetWalkById,
  getWalkById,
  showUpdateForm,
  submitUpdatedWalk,
  updateWalk,
  cancelUpdate,
  deleteWalk,
  displayResult,
  logout,
  exportExcel,
  validateJwtToken,
}

Object.keys(globalFunctions).forEach((key) => {
  window[key] = globalFunctions[key]
})
