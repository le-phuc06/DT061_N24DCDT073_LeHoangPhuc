# ==============================================================================
# Tệp: chay_web.jl — Máy chủ Web Julia khởi chạy giao diện mô phỏng Đề tài DT061
# Sinh viên: Lê Hoàng Phúc | MSSV: N24DCDT073 | Lớp: D24CQDT01-N
# Cách chạy: julia --startup-file=no chay_web.jl
# ==============================================================================

using Sockets

const PORT = 8080
const WEB_DIR = joinpath(@__DIR__, "web")

function mime_type(path::String)
    endswith(path, ".html") && return "text/html; charset=utf-8"
    endswith(path, ".css")  && return "text/css; charset=utf-8"
    endswith(path, ".js")   && return "application/javascript; charset=utf-8"
    endswith(path, ".png")  && return "image/png"
    return "text/plain; charset=utf-8"
end

function khoi_chay_may_chu_web(port::Int=PORT)
    server = listen(IPv4(127, 0, 0, 1), port)
    url = "http://localhost:$port"
    println("======================================================================")
    println("MÁY CHỦ WEB MÔ PHỎNG ĐỀ TÀI DT061 — DANH SÁCH LIÊN KẾT ĐƠN")
    println("Sinh viên: Lê Hoàng Phúc | MSSV: N24DCDT073 | Lớp: D24CQDT01-N")
    println("- Thư mục mã nguồn Web : $WEB_DIR")
    println("- Địa chỉ truy cập     : $url")
    println("- Nhấn Ctrl + C để dừng máy chủ.")
    println("======================================================================")

    # Tự động mở trình duyệt trên Windows / macOS / Linux nếu có thể
    try
        if Sys.iswindows()
            run(`cmd /c start $url`; wait=false)
        elseif Sys.isapple()
            run(`open $url`; wait=false)
        elseif Sys.islinux()
            run(`xdg-open $url`; wait=false)
        end
    catch
    end

    while isopen(server)
        sock = accept(server)
        @async begin
            try
                req_line = readline(sock)
                parts = split(req_line)
                req_path = length(parts) >= 2 ? String(parts[2]) : "/"
                clean_path = split(req_path, '?')[1]
                rel_file = (clean_path == "/" || clean_path == "") ? "index.html" : lstrip(clean_path, '/')
                full_path = normpath(joinpath(WEB_DIR, rel_file))

                if isfile(full_path) && startswith(full_path, normpath(WEB_DIR))
                    body = read(full_path)
                    ctype = mime_type(full_path)
                    header = "HTTP/1.1 200 OK\r\nContent-Type: $ctype\r\nContent-Length: $(sizeof(body))\r\nConnection: close\r\n\r\n"
                    write(sock, header)
                    write(sock, body)
                else
                    msg = "404 Not Found"
                    header = "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: $(sizeof(msg))\r\nConnection: close\r\n\r\n"
                    write(sock, header)
                    write(sock, msg)
                end
            catch
            finally
                close(sock)
            end
        end
    end
end

if abspath(PROGRAM_FILE) == @__FILE__
    khoi_chay_may_chu_web(PORT)
end
