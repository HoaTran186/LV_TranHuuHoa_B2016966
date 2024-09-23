function getCookieValue(name: string): string | null {
  const cookieStr = document.cookie; // Lấy toàn bộ chuỗi cookies từ trình duyệt
  const cookies = cookieStr.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string });

  return cookies[name] || null; // Trả về giá trị cookie với tên 'name' hoặc null nếu không tìm thấy
}
