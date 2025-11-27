document.addEventListener("DOMContentLoaded", function () {
  // ===== 매장 정보 (층 수) =====
  const storeConfig = {
    "dongsoong-art": { floors: 1 }, // 단층
    maronie: { floors: 2 },         // 복층
    hyehwa: { floors: 2 },          // 복층
  };

  let currentStoreId = "dongsoong-art";
  let currentFloor = 1;

  // ===== 모달 기본 처리 =====
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

  // Order 탭 클릭 시 매장 설정 모달 열기
  document.getElementById("navOrder").addEventListener("click", () => {
    openModal("list");
  });

  // ===== 매장 선택 시 상세 정보로 이동 =====
  const storeButtons = modal.querySelectorAll(".store-item");
  const storeNameTargets = modal.querySelectorAll(".selected-store-name");
  const storeAddrTarget = modal.querySelector(".selected-store-addr");

  storeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const storeId = btn.dataset.storeId || "dongsoong-art";
      currentStoreId = storeId;
      currentFloor = 1; // 매장 바꾸면 항상 1층부터

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

  // ===== 좌석 현황 관련 =====
  const floorRow = document.getElementById("floorBtnRow");
  const floorBtnLeft = document.getElementById("floorBtnLeft");
  const floorBtnRight = document.getElementById("floorBtnRight");
  const floorLabel = document.querySelector(".seat-floor-label");

  function updateSeatTitleFloor() {
    if (floorLabel) {
      floorLabel.textContent = currentFloor + "층";
    }
  }

  function renderFloorButtons() {
    const config = storeConfig[currentStoreId] || { floors: 1 };
    const totalFloors = config.floors || 1;

    if (!floorRow) return;

    // 단층 매장: 버튼 영역 숨김
    if (totalFloors === 1) {
      floorRow.style.display = "none";
      return;
    }

    // 복층 매장: 버튼 영역 표시
    floorRow.style.display = "flex";

    // 초기화
    [floorBtnLeft, floorBtnRight].forEach((btn) => {
      if (!btn) return;
      btn.classList.remove("disabled");
      btn.disabled = false;
      btn.dataset.targetFloor = "";
      const strong = btn.querySelector("strong");
      const span = btn.querySelector("span");
      if (span) span.textContent = "";
    });

    // 현재 층에 따라 텍스트/활성 상태 설정 (2층 구조 가정)
    if (currentFloor === 1) {
      // 최하층
      if (floorBtnLeft) {
        floorBtnLeft.querySelector("strong").textContent = "현재 최하층이에요.";
        floorBtnLeft.classList.add("disabled");
        floorBtnLeft.disabled = true;
      }
      if (floorBtnRight) {
        floorBtnRight.querySelector("strong").textContent =
          "다른 층이 궁금해요 2층";
        floorBtnRight.dataset.targetFloor = "2";
      }
    } else if (currentFloor === 2) {
      // 최상층
      if (floorBtnLeft) {
        floorBtnLeft.querySelector("strong").textContent =
          "다른 층이 궁금해요 1층";
        floorBtnLeft.dataset.targetFloor = "1";
      }
      if (floorBtnRight) {
        floorBtnRight.querySelector("strong").textContent =
          "현재 최상층이에요.";
        floorBtnRight.classList.add("disabled");
        floorBtnRight.disabled = true;
      }
    }
  }

  function applySeatState() {
    const config = storeConfig[currentStoreId] || { floors: 1 };
    const maxFloor = config.floors || 1;

    // 현재 층이 최대 층 수를 넘지 않도록 보정
    if (currentFloor > maxFloor) {
      currentFloor = maxFloor;
    }
    if (currentFloor < 1) {
      currentFloor = 1;
    }

    updateSeatTitleFloor();
    renderFloorButtons();
  }

  // 층 버튼 클릭 이벤트
  if (floorBtnLeft) {
    floorBtnLeft.addEventListener("click", () => {
      const target = floorBtnLeft.dataset.targetFloor;
      if (!target || floorBtnLeft.disabled) return;
      currentFloor = parseInt(target, 10) || 1;
      applySeatState();
    });
  }

  if (floorBtnRight) {
    floorBtnRight.addEventListener("click", () => {
      const target = floorBtnRight.dataset.targetFloor;
      if (!target || floorBtnRight.disabled) return;
      currentFloor = parseInt(target, 10) || 1;
      applySeatState();
    });
  }

  // 상세 -> 좌석 현황
  document
    .getElementById("openSeatPage")
    .addEventListener("click", () => {
      setModalPage("seat");
      applySeatState();
    });

  // 좌석 -> 상세 뒤로
  document
    .getElementById("seatBackBtn")
    .addEventListener("click", () => setModalPage("detail"));
});
