import Cocoa
import WebKit

final class AppDelegate: NSObject, NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate {
    private var window: NSWindow!
    private var webView: WKWebView!
    private var splashView: NSView!
    private var statusLabel: NSTextField!
    private var serverProcess: Process?
    private var launchedOwnServer = false

    private let appDir = "/Users/tamtran/Documents/WorkSpace/Globy/ChineseHSK"
    private let appURLString = "http://localhost:3000/dashboard"
    private let healthURL = URL(string: "http://127.0.0.1:3000")!

    func applicationDidFinishLaunching(_ notification: Notification) {
        setupAppIcon()
        setupMainMenu()
        setupWindow()
        startServerAndLoad()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

    func applicationWillTerminate(_ notification: Notification) {
        stopServerIfOwned()
    }

    private func setupAppIcon() {
        if let iconPath = Bundle.main.path(forResource: "AppIcon", ofType: "icns"),
           let icon = NSImage(contentsOfFile: iconPath) {
            NSApp.applicationIconImage = icon
        }
    }

    private func setupMainMenu() {
        let mainMenu = NSMenu()

        // App Menu
        let appMenuItem = NSMenuItem()
        mainMenu.addItem(appMenuItem)
        let appMenu = NSMenu()
        appMenu.addItem(NSMenuItem(title: "Về Chinese HSK Journey", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: ""))
        appMenu.addItem(NSMenuItem.separator())
        let homeItem = NSMenuItem(title: "Trang chủ Bảng điều khiển", action: #selector(goHome), keyEquivalent: "h")
        homeItem.target = self
        appMenu.addItem(homeItem)
        let reloadItem = NSMenuItem(title: "Tải lại trang", action: #selector(reloadPage), keyEquivalent: "r")
        reloadItem.target = self
        appMenu.addItem(reloadItem)
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(NSMenuItem(title: "Ẩn ứng dụng", action: #selector(NSApplication.hide(_:)), keyEquivalent: "m"))
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(NSMenuItem(title: "Thoát Chinese HSK Journey", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q"))
        appMenuItem.submenu = appMenu

        // Edit Menu (enables Cmd+C, Cmd+V, Cmd+X, Cmd+A, Cmd+Z inside WebView)
        let editMenuItem = NSMenuItem()
        mainMenu.addItem(editMenuItem)
        let editMenu = NSMenu(title: "Chỉnh sửa")
        editMenu.addItem(NSMenuItem(title: "Hoàn tác", action: Selector(("undo:")), keyEquivalent: "z"))
        editMenu.addItem(NSMenuItem(title: "Làm lại", action: Selector(("redo:")), keyEquivalent: "Z"))
        editMenu.addItem(NSMenuItem.separator())
        editMenu.addItem(NSMenuItem(title: "Cắt", action: #selector(NSText.cut(_:)), keyEquivalent: "x"))
        editMenu.addItem(NSMenuItem(title: "Sao chép", action: #selector(NSText.copy(_:)), keyEquivalent: "c"))
        editMenu.addItem(NSMenuItem(title: "Dán", action: #selector(NSText.paste(_:)), keyEquivalent: "v"))
        editMenu.addItem(NSMenuItem(title: "Chọn tất cả", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a"))
        editMenuItem.submenu = editMenu

        // Window Menu
        let windowMenuItem = NSMenuItem()
        mainMenu.addItem(windowMenuItem)
        let windowMenu = NSMenu(title: "Cửa sổ")
        windowMenu.addItem(NSMenuItem(title: "Thu nhỏ", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "w"))
        windowMenu.addItem(NSMenuItem(title: "Phóng to", action: #selector(NSWindow.performZoom(_:)), keyEquivalent: ""))
        windowMenuItem.submenu = windowMenu

        NSApp.mainMenu = mainMenu
    }

    private func setupWindow() {
        let frame = NSRect(x: 0, y: 0, width: 1280, height: 840)
        window = NSWindow(
            contentRect: frame,
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = "Chinese HSK Journey — Tự học tiếng Trung HSK 1–9"
        window.minSize = NSSize(width: 960, height: 640)
        window.center()
        window.setFrameAutosaveName("ChineseHSKJourneyMainWindow")

        let container = NSView(frame: frame)
        container.autoresizingMask = [.width, .height]
        window.contentView = container

        let config = WKWebViewConfiguration()
        config.websiteDataStore = WKWebsiteDataStore.default()
        config.mediaTypesRequiringUserActionForPlayback = []
        config.preferences.setValue(true, forKey: "developerExtrasEnabled")

        webView = WKWebView(frame: container.bounds, configuration: config)
        webView.autoresizingMask = [.width, .height]
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.allowsBackForwardNavigationGestures = true
        webView.isHidden = true
        container.addSubview(webView)

        // Native Splash View while server boots
        splashView = NSView(frame: container.bounds)
        splashView.autoresizingMask = [.width, .height]
        splashView.wantsLayer = true
        splashView.layer?.backgroundColor = NSColor(calibratedRed: 0.024, green: 0.306, blue: 0.231, alpha: 1.0).cgColor

        let stack = NSStackView()
        stack.orientation = .vertical
        stack.alignment = .centerX
        stack.spacing = 14
        stack.translatesAutoresizingMaskIntoConstraints = false

        if let icon = NSApp.applicationIconImage {
            let imageView = NSImageView(image: icon)
            imageView.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                imageView.widthAnchor.constraint(equalToConstant: 96),
                imageView.heightAnchor.constraint(equalToConstant: 96)
            ])
            stack.addArrangedSubview(imageView)
        }

        let titleLabel = NSTextField(labelWithString: "Chinese HSK Journey")
        titleLabel.font = NSFont.systemFont(ofSize: 24, weight: .bold)
        titleLabel.textColor = NSColor.white
        stack.addArrangedSubview(titleLabel)

        statusLabel = NSTextField(labelWithString: "Đang khởi động hệ thống học tập cục bộ...")
        statusLabel.font = NSFont.systemFont(ofSize: 14, weight: .medium)
        statusLabel.textColor = NSColor(calibratedRed: 0.984, green: 0.749, blue: 0.141, alpha: 1.0)
        stack.addArrangedSubview(statusLabel)

        let spinner = NSProgressIndicator()
        spinner.style = .spinning
        spinner.controlSize = .regular
        spinner.startAnimation(nil)
        stack.addArrangedSubview(spinner)

        splashView.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.centerXAnchor.constraint(equalTo: splashView.centerXAnchor),
            stack.centerYAnchor.constraint(equalTo: splashView.centerYAnchor)
        ])
        container.addSubview(splashView)

        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    @objc private func reloadPage() {
        webView.reload()
    }

    @objc private func goHome() {
        if let url = URL(string: appURLString) {
            webView.load(URLRequest(url: url))
        }
    }

    private func startServerAndLoad() {
        isServerReachable { [weak self] reachable in
            guard let self = self else { return }
            if reachable {
                DispatchQueue.main.async {
                    self.loadDashboard()
                }
                return
            }

            self.launchLocalServer()
            self.waitForServer(attempts: 45)
        }
    }

    private func launchLocalServer() {
        let buildIdPath = "\(appDir)/.next/BUILD_ID"
        let hasProdBuild = FileManager.default.fileExists(atPath: buildIdPath)
        let cmd = hasProdBuild ? "npm run start" : "npm run dev"

        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/bin/zsh")
        process.arguments = ["-l", "-c", "export PATH=\"/opt/homebrew/bin:/usr/local/bin:$PATH\" && cd \"\(appDir)\" && exec \(cmd)"]
        let logHandle = FileHandle(forWritingAtPath: "/tmp/chinese-hsk-journey.log")
        if let logHandle = logHandle {
            process.standardOutput = logHandle
            process.standardError = logHandle
        } else {
            FileManager.default.createFile(atPath: "/tmp/chinese-hsk-journey.log", contents: nil)
            if let handle = FileHandle(forWritingAtPath: "/tmp/chinese-hsk-journey.log") {
                process.standardOutput = handle
                process.standardError = handle
            }
        }

        do {
            try process.run()
            self.serverProcess = process
            self.launchedOwnServer = true
        } catch {
            DispatchQueue.main.async {
                self.statusLabel.stringValue = "Lỗi khởi động máy chủ cục bộ: \(error.localizedDescription)"
            }
        }
    }

    private func stopServerIfOwned() {
        guard launchedOwnServer, let proc = serverProcess, proc.isRunning else { return }
        let pid = proc.processIdentifier
        proc.terminate()
        // Also ensure Next.js child process on port 3000 terminates cleanly
        let cleanup = Process()
        cleanup.executableURL = URL(fileURLWithPath: "/bin/zsh")
        cleanup.arguments = ["-c", "pkill -TERM -P \(pid) 2>/dev/null; kill -TERM \(pid) 2>/dev/null || true"]
        try? cleanup.run()
        cleanup.waitUntilExit()
    }

    private func isServerReachable(completion: @escaping (Bool) -> Void) {
        var req = URLRequest(url: healthURL)
        req.timeoutInterval = 1.0
        URLSession.shared.dataTask(with: req) { _, response, error in
            if error == nil, let http = response as? HTTPURLResponse, http.statusCode < 500 {
                completion(true)
            } else {
                completion(false)
            }
        }.resume()
    }

    private func waitForServer(attempts: Int) {
        if attempts <= 0 {
            DispatchQueue.main.async {
                self.statusLabel.stringValue = "Không thể kết nối tới http://localhost:3000. Hãy kiểm tra log tại /tmp/chinese-hsk-journey.log"
            }
            return
        }

        isServerReachable { [weak self] ok in
            guard let self = self else { return }
            if ok {
                DispatchQueue.main.async {
                    self.loadDashboard()
                }
            } else {
                DispatchQueue.global().asyncAfter(deadline: .now() + 0.5) {
                    self.waitForServer(attempts: attempts - 1)
                }
            }
        }
    }

    private func loadDashboard() {
        guard let url = URL(string: appURLString) else { return }
        webView.load(URLRequest(url: url))
    }

    // MARK: - WKNavigationDelegate
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        splashView.isHidden = true
        webView.isHidden = false
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if let url = navigationAction.request.url,
           let host = url.host,
           host != "localhost" && host != "127.0.0.1" && navigationAction.navigationType == .linkActivated {
            NSWorkspace.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }

    // MARK: - WKUIDelegate
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let url = navigationAction.request.url {
            if url.host == "localhost" || url.host == "127.0.0.1" {
                webView.load(navigationAction.request)
            } else {
                NSWorkspace.shared.open(url)
            }
        }
        return nil
    }

    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alert = NSAlert()
        alert.messageText = "Chinese HSK Journey"
        alert.informativeText = message
        alert.addButton(withTitle: "OK")
        alert.runModal()
        completionHandler()
    }

    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let alert = NSAlert()
        alert.messageText = "Chinese HSK Journey"
        alert.informativeText = message
        alert.addButton(withTitle: "Đồng ý")
        alert.addButton(withTitle: "Hủy")
        let response = alert.runModal()
        completionHandler(response == .alertFirstButtonReturn)
    }

    @available(macOS 12.0, *)
    func webView(_ webView: WKWebView, requestMediaCapturePermissionFor origin: WKSecurityOrigin, initiatedByFrame frame: WKFrameInfo, type: WKMediaCaptureType, decisionHandler: @escaping (WKPermissionDecision) -> Void) {
        decisionHandler(.grant)
    }
}

let app = NSApplication.shared
app.setActivationPolicy(.regular)
let delegate = AppDelegate()
app.delegate = delegate
app.run()
