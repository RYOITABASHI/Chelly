import type { AiCommand } from "@/lib/command-executor";

export const SOUND_ART_SAMPLE_PATH = "./labs/sound-reactive-art/index.html";

export function buildSoundReactiveArtSampleCommands(): AiCommand[] {
  return [
    {
      desc: "音に反応する光のアートのサンプルを作成",
      cmd: `mkdir -p ./labs/sound-reactive-art && cat > ${SOUND_ART_SAMPLE_PATH} << 'EOF'
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Chelly Sound Reactive Art</title>
  <style>
    html, body { margin: 0; height: 100%; overflow: hidden; background: #020617; color: white; font-family: system-ui, sans-serif; }
    canvas { width: 100vw; height: 100vh; display: block; }
    .panel { position: fixed; left: 16px; right: 16px; bottom: 16px; padding: 14px; border: 1px solid rgba(255,255,255,.18); border-radius: 18px; background: rgba(2,6,23,.72); backdrop-filter: blur(12px); }
    button { border: 0; border-radius: 999px; padding: 12px 16px; background: #22c55e; color: #04130a; font-weight: 800; }
    .hint { margin-top: 10px; color: #94a3b8; font-size: 13px; line-height: 1.5; }
  </style>
</head>
<body>
  <canvas id="art"></canvas>
  <div class="panel">
    <button id="start">マイクで動かす</button>
    <div class="hint">声や手拍子の大きさで、光の粒の広がりと色が変わります。マイクが使えない場合は自動でゆっくり動きます。</div>
  </div>
  <script>
    const canvas = document.getElementById('art');
    const ctx = canvas.getContext('2d');
    const start = document.getElementById('start');
    let level = 0.15;
    let t = 0;

    function resize() {
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    addEventListener('resize', resize);
    resize();

    async function useMic() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audio = new AudioContext();
      const source = audio.createMediaStreamSource(stream);
      const analyser = audio.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      function read() {
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (const v of data) sum += v;
        level = Math.min(1, Math.max(0.05, sum / data.length / 150));
        requestAnimationFrame(read);
      }
      read();
    }

    start.onclick = () => useMic().catch(() => { start.textContent = '自動モードで再生中'; });

    function draw() {
      t += 0.016;
      if (level < 0.18) level = 0.12 + Math.abs(Math.sin(t * 0.8)) * 0.18;
      const w = innerWidth;
      const h = innerHeight;
      ctx.fillStyle = 'rgba(2, 6, 23, 0.18)';
      ctx.fillRect(0, 0, w, h);

      const count = 90;
      const cx = w / 2;
      const cy = h / 2;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + t * (0.2 + level);
        const wave = Math.sin(t * 2 + i * 0.37);
        const r = 50 + i * 2.5 + wave * 22 + level * 220;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a * 1.4) * r * 0.55;
        const hue = (190 + i * 2 + level * 160 + t * 30) % 360;
        ctx.beginPath();
        ctx.fillStyle = 'hsla(' + hue + ', 95%, 62%, ' + (0.28 + level * 0.55) + ')';
        ctx.shadowColor = 'hsl(' + hue + ', 95%, 62%)';
        ctx.shadowBlur = 14 + level * 28;
        ctx.arc(x, y, 2 + level * 9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      requestAnimationFrame(draw);
    }
    draw();
  </script>
</body>
</html>
EOF
echo CHELLY_PREVIEW:${SOUND_ART_SAMPLE_PATH}`,
    },
  ];
}
