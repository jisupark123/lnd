export type Pagination = {
  currentPage: number; // 현재 페이지
  startPage: number; // 버튼바 첫번째 페이지 (6 7 8 9 10) -> 6
  lastPage: number; // 버튼바 마지막 페이지 (6 7 8 9 10) -> 8
  pageCount: number; // 총 페이지 개수 (1 ~ 60) -> 60
};
