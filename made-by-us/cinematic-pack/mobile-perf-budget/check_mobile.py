#!/usr/bin/env python3
"""Mobile check at 412x915 with an Android Chrome UA, touch, 4x CPU throttle and Fast-4G-ish network.
usage: python3 check_mobile.py URL [out_prefix]
Prints JSON: transfer KB, requests, LCP, CLS, long tasks, scroll FPS, console errors; saves 3 screenshots.
Needs: pip install playwright && playwright install chromium."""
import json, sys
from playwright.sync_api import sync_playwright

URL = sys.argv[1]; OUT = sys.argv[2] if len(sys.argv) > 2 else "mobile"
UA = ("Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36")
OBS = """
window.__m = {lcp:0, cls:0, long:0, longMs:0};
new PerformanceObserver(l => l.getEntries().forEach(e => __m.lcp = e.startTime)).observe({type:'largest-contentful-paint', buffered:true});
new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) __m.cls += e.value; })).observe({type:'layout-shift', buffered:true});
new PerformanceObserver(l => l.getEntries().forEach(e => { __m.long++; __m.longMs += e.duration; })).observe({type:'longtask', buffered:true});
"""
FPS = """async () => { const H = document.documentElement.scrollHeight - innerHeight; let frames = 0, t0 = performance.now();
  await new Promise(res => { const step = () => { frames++; const p = (performance.now() - t0) / 4000;
    scrollTo(0, H * Math.min(1, p)); p < 1 ? requestAnimationFrame(step) : res(); }; requestAnimationFrame(step); });
  return frames / ((performance.now() - t0) / 1000); }"""

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 412, "height": 915}, device_scale_factor=2.625,
                        is_mobile=True, has_touch=True, user_agent=UA)
    page = ctx.new_page()
    cdp = ctx.new_cdp_session(page)
    cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})
    cdp.send("Network.enable")
    cdp.send("Network.emulateNetworkConditions", {"offline": False, "latency": 150,
             "downloadThroughput": 1.6e6 / 8 * 4, "uploadThroughput": 750e3 / 8})
    errors, reqs, kb = [], [0], [0.0]
    page.on("console", lambda m: m.type == "error" and errors.append(m.text))
    page.on("pageerror", lambda e: errors.append(str(e)))
    cdp.on("Network.loadingFinished", lambda e: (reqs.__setitem__(0, reqs[0] + 1), kb.__setitem__(0, kb[0] + e["encodedDataLength"] / 1024)))
    page.add_init_script(OBS)
    page.goto(URL, wait_until="load", timeout=90000)
    page.wait_for_timeout(2500)
    page.screenshot(path=f"{OUT}-top.png")
    fps = page.evaluate(FPS)
    page.screenshot(path=f"{OUT}-end.png")
    page.evaluate("scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2)")
    page.wait_for_timeout(800); page.screenshot(path=f"{OUT}-mid.png")
    m = page.evaluate("window.__m")
    res = {"url": URL, "transfer_kb": round(kb[0]), "requests": reqs[0], "lcp_ms": round(m["lcp"]),
           "cls": round(m["cls"], 3), "long_tasks": m["long"], "long_task_ms": round(m["longMs"]),
           "scroll_fps_4x_cpu": round(fps, 1), "console_errors": errors[:10]}
    budget = {"transfer_kb": 3000, "lcp_ms": 2500, "cls": 0.1, "long_task_ms": 600}
    res["over_budget"] = [k for k, v in budget.items() if res[k] > v] + (["fps"] if fps < 45 else [])
    print(json.dumps(res, indent=1))
    b.close()
