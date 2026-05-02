export type SteamStarter = {
  title: string;
  ageBand: string;
  prompt: string;
  learn: string;
  icon: string;
};

export const STEAM_STARTERS: SteamStarter[] = [
  {
    title: "音に反応する光のアート",
    ageBand: "小4〜高校",
    icon: "🎛️",
    learn: "音量、周波数、色、ジェネラティブアート",
    prompt:
      "音に反応する光のデジタルアートを作りたい。すぐ作り始める前に、どんな表現にしたいかを考えさせる質問を1つ出して、2〜3個の選択肢を示して。選んだら ./labs/sound-reactive-art/index.html に自己完結HTMLで作品を作り、最後に echo CHELLY_PREVIEW:./labs/sound-reactive-art/index.html を実行して。音量や周波数で色や形が変わる作品にして、音と色と動きの関係を説明して。TouchDesignerやvvvvのようなノード表現では何に相当するかもやさしく説明して。",
  },
  {
    title: "模様が生まれるジェネラティブアート",
    ageBand: "小5〜高校",
    icon: "🌀",
    learn: "反復、ランダム、周期、パターン",
    prompt:
      "模様が自動で生まれるジェネラティブアートを作りたい。すぐ作り始める前に、どんな雰囲気の作品にしたいかを考えさせる質問を1つ出して、2〜3個の選択肢を示して。選んだら ./labs/generative-pattern/index.html に自己完結HTMLで動く模様を作り、最後に echo CHELLY_PREVIEW:./labs/generative-pattern/index.html を実行して。反復・ランダム・周期がどう表現に関わるかを説明して。最後に色・速さ・形を変える改造ポイントを出して。",
  },
  {
    title: "月に着陸するロケットゲーム",
    ageBand: "小5〜高校",
    icon: "🚀",
    learn: "重力、速度、燃料、条件分岐",
    prompt:
      "月に着陸するロケットゲームを作りたい。すぐ作り始める前に、どんなロケットゲームにするかを考えさせる質問を1つ出して、2〜3個の選択肢を示して。選んだら ./labs/rocket-landing/index.html に自己完結HTMLで遊べる作品を作り、最後に echo CHELLY_PREVIEW:./labs/rocket-landing/index.html を実行して。そのあと重力・速度・燃料の仕組みを小学生にも分かるように説明して。最後に、数字を変えて実験できる改造ポイントを3つ出して。",
  },
  {
    title: "音を見える化する実験",
    ageBand: "小4〜高校",
    icon: "〰️",
    learn: "波形、音量、周波数、グラフ",
    prompt:
      "マイクの音を見える化する実験を作りたい。すぐ作り始める前に、何を観察したいかを考えさせる質問を1つ出して、2〜3個の選択肢を示して。選んだら ./labs/sound-visualizer/index.html に自己完結HTMLで音量や波形がどう変わるかを観察できる作品を作り、最後に echo CHELLY_PREVIEW:./labs/sound-visualizer/index.html を実行して。音の高さ・大きさ・波形の関係を説明して。コードのどこを変えると表示が変わるかも教えて。",
  },
  {
    title: "ジャンプするキャラゲーム",
    ageBand: "小3〜中学",
    icon: "🐈",
    learn: "座標、速度、重力、ゲームループ",
    prompt:
      "ジャンプするキャラのミニゲームを作りたい。すぐ作り始める前に、どんな動きにしたいかを考えさせる質問を1つ出して、2〜3個の選択肢を示して。選んだら ./labs/jump-game/index.html に自己完結HTMLで動くものを作り、最後に echo CHELLY_PREVIEW:./labs/jump-game/index.html を実行して。そのあと position、velocity、gravity が何をしているかをやさしく説明して。ジャンプ力や重力を変える実験も提案して。",
  },
];
