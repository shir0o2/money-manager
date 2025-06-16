// Inisialisasi Modal Transaksi
function initTransactionModal() {
  const modal = document.getElementById('transactionModal');
  const openButtons = document.querySelectorAll('[data-target="transactionModal"]');
  const closeButton = document.querySelector('.close-modal');
  const cancelButton = document.querySelector('.btn-cancel');
  
  // Buka modal
  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Tutup modal
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  
  closeButton.addEventListener('click', closeModal);
  cancelButton.addEventListener('click', closeModal);
  
  // Tutup saat klik di luar modal
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Pilih Jenis Transaksi
  const typeButtons = document.querySelectorAll('.type-btn');
  typeButtons.forEach(button => {
    button.addEventListener('click', () => {
      typeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      document.getElementById('transactionType').value = button.dataset.type;
    });
  });
  
  // Pilih Kategori
  const categoryItems = document.querySelectorAll('.category-item');
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      categoryItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      document.getElementById('transactionCategory').value = item.dataset.category;
    });
  });
  
  // Quick Amount Buttons
  const quickAmountButtons = document.querySelectorAll('.quick-amount-buttons button');
  quickAmountButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('transactionAmount').value = button.dataset.amount;
    });
  });
  
  // Set tanggal default ke hari ini
  document.getElementById('transactionDate').valueAsDate = new Date();
  
  // Handle form submission
  document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const transaction = {
      id: Date.now(),
      type: document.getElementById('transactionType').value,
      name: document.getElementById('transactionName').value,
      amount: parseFloat(document.getElementById('transactionAmount').value),
      category: document.getElementById('transactionCategory').value,
      date: document.getElementById('transactionDate').value,
      notes: document.getElementById('transactionNotes').value,
      createdAt: new Date().toISOString()
    };
    
    // Simpan transaksi
    saveTransaction(transaction);
    
    // Tutup modal dan reset form
    closeModal();
    this.reset();
    document.getElementById('transactionDate').valueAsDate = new Date();
    
    // Update UI
    updateTransactionsUI();
    updateSummary();
    
    // Tampilkan notifikasi
    showNotification('Transaksi berhasil disimpan!', 'success');
  });
}

// Panggil fungsi inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  initTransactionModal();
  
  // Pilih kategori "Gaji" secara default
  document.querySelector('.category-item[data-category="salary"]').classList.add('selected');
});

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Animasi muncul
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hilangkan setelah 3 detik
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}