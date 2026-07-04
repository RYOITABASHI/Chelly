export type LearningInsight = {
  title: string;
  concepts: string[];
  mechanisms: Array<{
    title: string;
    body: string;
    codeHint?: string;
  }>;
  nodeMap: Array<{
    label: string;
    body: string;
  }>;
  tweaks: Array<{
    title: string;
    body: string;
    target: string;
  }>;
};

const SOUND_REACTIVE_INSIGHT: LearningInsight = {
  title: "音に反応する光のアート",
  concepts: ["マイク入力", "音量", "周波数", "Canvas", "色", "周期運動"],
  mechanisms: [
    {
      title: "1. マイクの音を数字にする",
      body: "getUserMediaでマイク入力を受け取り、AnalyserNodeで音の強さを周波数ごとの数値に変えています。",
      codeHint: "navigator.mediaDevices.getUserMedia / audio.createAnalyser()",
    },
    {
      title: "2. 音量をlevelにまとめる",
      body: "周波数データの平均を取り、0から1くらいのlevelにします。このlevelが作品全体の動きのつまみです。",
      codeHint: "level = Math.min(1, Math.max(0.05, sum / data.length / 150))",
    },
    {
      title: "3. 毎フレーム描き直す",
      body: "requestAnimationFrame(draw)で、画面を1秒に何十回も描き直します。これで静止画ではなく動く作品になります。",
      codeHint: "requestAnimationFrame(draw)",
    },
    {
      title: "4. 三角関数で粒を配置する",
      body: "Math.sinとMath.cosで粒を円や波のように配置します。角度と時間を少しずつ変えることで、模様が回転します。",
      codeHint: "Math.cos(a) / Math.sin(a * 1.4)",
    },
    {
      title: "5. 音で色と大きさを変える",
      body: "levelを半径、色相、光のぼかしに足しています。大きな音ほど粒が広がり、色も変化します。",
      codeHint: "hue / shadowBlur / ctx.arc(... level * 9 ...)",
    },
  ],
  nodeMap: [
    {
      label: "TouchDesigner / vvvvでいう入力ノード",
      body: "マイク入力を受け取る部分です。WebではgetUserMedia、ノード型ツールではAudio Inに相当します。",
    },
    {
      label: "解析ノード",
      body: "AnalyserNodeが音を数値配列に変えます。ここで音を作品の材料にしています。",
    },
    {
      label: "数学ノード",
      body: "sin、cos、levelの掛け算で位置、広がり、揺れを決めています。",
    },
    {
      label: "描画ノード",
      body: "Canvasのctx.arcやfillが、最終的に画面へ光の粒を描きます。",
    },
  ],
  tweaks: [
    {
      title: "色を変える",
      body: "hueの式を変えると、青系、赤系、虹色などにできます。",
      target: "const hue = (190 + i * 2 + level * 160 + t * 30) % 360;",
    },
    {
      title: "粒を増やす",
      body: "countを増やすと密度が上がります。重くなったら少し減らします。",
      target: "const count = 90;",
    },
    {
      title: "音への反応を強くする",
      body: "levelに掛けている数字を大きくすると、音に対して大きく動きます。",
      target: "level * 220 / level * 9 / level * 28",
    },
    {
      title: "動きの形を変える",
      body: "sinやcosの中の数字を変えると、円、波、渦巻きの形が変化します。",
      target: "Math.sin(t * 2 + i * 0.37) / Math.sin(a * 1.4)",
    },
  ],
};

const GENERIC_HTML_INSIGHT: LearningInsight = {
  title: "HTML作品",
  concepts: ["HTML", "CSS", "JavaScript", "画面描画"],
  mechanisms: [
    {
      title: "HTMLは作品の骨組み",
      body: "どんな部品を画面に置くかを決めます。canvas、button、divなどを探すと構造が見えます。",
      codeHint: "<canvas> / <button> / <div>",
    },
    {
      title: "CSSは見た目",
      body: "色、余白、角丸、背景などを決めます。まずbackgroundやcolorを探すと改造しやすいです。",
      codeHint: "<style> ... </style>",
    },
    {
      title: "JavaScriptは動き",
      body: "クリック、アニメーション、計算、音や入力への反応を担当します。",
      codeHint: "<script> ... </script>",
    },
  ],
  nodeMap: [
    {
      label: "入力",
      body: "ボタン、マイク、タッチ、キーボードなど、作品に入ってくる情報です。",
    },
    {
      label: "変換",
      body: "入力を数字や状態に変える部分です。if、for、関数、数式がよく出てきます。",
    },
    {
      label: "出力",
      body: "画面、音、色、動きとして結果を出す部分です。",
    },
  ],
  tweaks: [
    {
      title: "色を変える",
      body: "CSSのcolorやbackground、JavaScript内の色指定を探します。",
      target: "color / background / hsl / rgb / #",
    },
    {
      title: "動きを変える",
      body: "requestAnimationFrame、setInterval、速度や時間に関係する変数を探します。",
      target: "requestAnimationFrame / speed / time / t",
    },
    {
      title: "数を変える",
      body: "count、size、limitのような変数を探すと、粒やキャラクターの数を変えやすいです。",
      target: "count / size / limit",
    },
  ],
};

export function buildLearningInsight(filePath: string, html: string): LearningInsight {
  const normalized = filePath.toLowerCase();
  if (
    normalized.includes("sound-reactive-art") ||
    (html.includes("createAnalyser") && html.includes("getUserMedia"))
  ) {
    return SOUND_REACTIVE_INSIGHT;
  }

  return GENERIC_HTML_INSIGHT;
}
