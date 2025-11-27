document.addEventListener("DOMContentLoaded", function () {
  // ===== 모달 관련 =====
  const modal = document.getElementById("storeModal");
  const modalPages = modal.querySelectorAll(".modal-page");

  function setModalPage(pageId) {
    modalPages.forEach((page) => {
      page.classList.toggle("active", page.dataset.page === pageId);
    });
  }

  function openModal(pageId) {
    setModalPage(pageId);
    modal.classList.add("open");
  }

  function closeModal() {
    modal.classList.remove("open");
  }

  // 배경 클릭 시 모달 닫기
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Order 탭 클릭 시 매장 설정 모달
  document.getElementById("navOrder").addEventListener("click", () => {
    openModal("list");
  });

  // 매장 선택 시 상세 페이지로
  const storeButtons = modal.querySelectorAll(".store-item");
  const storeNameTargets = modal.querySelectorAll(".selected-store-name");
  const storeAddrTarget = modal.querySelector(".selected-store-addr");

  storeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.querySelector(".store-name").textContent.trim();
      const addr = btn.querySelector(".store-addr").textContent.trim();
      storeNameTargets.forEach((el) => (el.textContent = name));
      if (storeAddrTarget) storeAddrTarget.textContent = addr;
      openModal("detail");
    });
  });

  // 상세 -> 목록 뒤로
  document
    .getElementById("detailBackBtn")
    .addEventListener("click", () => setModalPage("list"));

  // 상세 -> 좌석 현황
  document
    .getElementById("openSeatPage")
    .addEventListener("click", () => setModalPage("seat"));

  // 좌석 -> 상세 뒤로
  document
    .getElementById("seatBackBtn")
    .addEventListener("click", () => setModalPage("detail"));

  // ===== 좌석 그리드 =====
  const seatGrid = document.getElementById("seatGrid");

  function buildSeatGrid(patternType) {
    seatGrid.innerHTML = "";
    const total = 80; // 10 x 8
    for (let i = 0; i < total; i++) {
      const cell = document.createElement("div");
      cell.classList.add("seat-cell");

      if (patternType === "1") {
        if (i % 7 === 0 || i % 11 === 0) {
          cell.classList.add("busy");
        } else if (i % 5 === 0) {
          cell.classList.add("none");
        } else {
          cell.classList.add("free");
        }
      } else {
        if (i % 4 === 0 || i % 6 === 0) {
          cell.classList.add("busy");
        } else if (i % 9 === 0) {
          cell.classList.add("none");
        } else {
          cell.classList.add("free");
        }
      }

      seatGrid.appendChild(cell);
    }
  }

  buildSeatGrid("1");

  // 층 버튼
  const floorButtons = document.querySelectorAll(".floor-btn");
  floorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      floorButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      const floor = btn.dataset.floor;
      buildSeatGrid(floor);
    });
  });
});
