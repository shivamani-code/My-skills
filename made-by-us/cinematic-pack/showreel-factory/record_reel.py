#!/usr/bin/env python3
"""Record a buttery showreel of a scroll site on a virtual clock, then composite it onto a phone mockup with sound.
usage: python3 record_reel.py URL out.mp4 [seconds=10] [fps=30]
How: Playwright's fake clock (page.clock) freezes time; each output frame we advance the clock by 1/fps,
set scroll by an eased curve, and screenshot. Every frame is perfect regardless of machine speed.
Then ffmpeg: frames -> video, phone frame + background + caption, synthesized drone + hit, -> 1080x1920 H.264."""
import math, os, shutil, subprocess, sys, tempfile
from playwright.sync_api import sync_playwright

URL, OUT = sys.argv[1], sys.argv[2]
SECS = float(sys.argv[3]) if len(sys.argv) > 3 else 10.0
FPS = int(sys.argv[4]) if len(sys.argv) > 4 else 30
W, H = 412, 915
UA = "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36"
tmp = tempfile.mkdtemp(prefix="reel-")

def ease(t):  # hold 8%, ease-in-out scroll, hold 10% at the end
    t = min(1, max(0, (t - 0.08) / 0.82))
    return t * t * (3 - 2 * t)

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": W, "height": H}, device_scale_factor=2, is_mobile=True, has_touch=True, user_agent=UA)
    page = ctx.new_page()
    page.clock.install()                       # fake Date/performance/timers/rAF
    page.goto(URL, wait_until="networkidle", timeout=120000)
    page.wait_for_timeout(1500)                # real time for image decoding
    page.clock.pause_at(page.evaluate("Date.now()") + 1000)   # freeze: from here time moves only when we say
    page.clock.run_for(2000)                   # let intro animations settle in virtual time
    total = page.evaluate("document.documentElement.scrollHeight - innerHeight")
    n = int(SECS * FPS)
    for i in range(n):
        page.evaluate(f"window.scrollTo(0, {total * ease(i / (n - 1)):.1f})")
        page.clock.run_for(int(1000 / FPS))
        page.screenshot(path=f"{tmp}/f{i:05d}.png")
    b.close()

screen = f"{tmp}/screen.mp4"
subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-framerate", str(FPS), "-i", f"{tmp}/f%05d.png",
                "-vf", "scale=744:-2", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", screen], check=True)
# Phone mockup drawn by ffmpeg: dark gradient bg, square black bezel (drawbox; overlay a PNG frame for rounded corners), screen overlay, caption.
sx, sy = (1080 - 744) // 2, 230
vf = (f"[0:v]scale=1080:1920,format=yuv420p[bg];"
      f"[bg]drawbox=x={sx-18}:y={sy-18}:w={744+36}:h=1690:color=black@1:t=fill[bz];"
      f"[bz][1:v]overlay={sx}:{sy}:shortest=1[v]")
audio = (f"aevalsrc='0.25*sin(2*PI*55*t)*(0.6+0.4*sin(2*PI*0.25*t))+0.12*sin(2*PI*82.4*t)"
         f"+0.6*exp(-6*max(t-{SECS*0.47:.2f},0))*sin(2*PI*48*t)*gte(t,{SECS*0.47:.2f})':s=48000:d={SECS}")
subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y",
                "-f", "lavfi", "-i", f"gradients=s=1080x1920:c0=0x07080c:c1=0x1a1210:d={SECS}:speed=0.01",
                "-i", screen, "-f", "lavfi", "-i", audio,
                "-filter_complex", vf, "-map", "[v]", "-map", "2:a",
                "-c:v", "libx264", "-crf", "20", "-preset", "medium", "-pix_fmt", "yuv420p",
                "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", OUT], check=True)
shutil.rmtree(tmp)
print(OUT)
