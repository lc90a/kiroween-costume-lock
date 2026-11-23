// Costume Lock Studio — 服装数据 + 提示词生成 + 复制 + 验帧

const COSTUMES = [
  {
    id: "purple",
    name: "紫色半透明古风纱裙",
    desc: "金色刺绣 · 水晶流苏头饰",
    colorLock: "紫色半透明古风轻纱长裙，金色刺绣，水晶流苏头饰",
    morandi: "紫色莫兰迪配色（紫罗兰、淡紫、银白为主）",
    dress: "紫色半透明古风轻纱长裙，金色刺绣",
    headdress: "水晶流苏头饰",
    background: "樱花庭院背景"
  },
  {
    id: "cyan",
    name: "淡青色轻纱长裙",
    desc: "银饰流苏 · 魏晋服饰",
    colorLock: "淡青色半透明古风轻纱长裙，银色刺绣，银饰流苏头饰",
    morandi: "青绿莫兰迪配色（淡青、银白、浅灰为主）",
    dress: "淡青色半透明古风轻纱长裙，银色刺绣",
    headdress: "银饰流苏头饰",
    background: "古建筑庭院背景"
  },
  {
    id: "white",
    name: "白色短裙",
    desc: "河边夕阳 · 固定机位",
    colorLock: "白色短裙，膝盖以上，暖金夕阳光",
    morandi: "暖白配色（白色、暖金为主）",
    dress: "白色短裙，裙摆到膝盖以上",
    headdress: "无头饰，黑长发自然垂落",
    background: "河边夕阳背景"
  }
];

let selected = COSTUMES[0];

function buildImagePrompt(c) {
  return [
    "服装颜色锁定：" + c.colorLock + "，全程不许换色、不许换衣服。",
    "杰作级画质，顶级图像精度，超高清细节渲染，单人女性角色，（黑色长发：1.4），（精致立体的美颜五官：1.4），美颜全开，光滑油亮的皮肤，水嫩的肌肤，一个女孩，",
    "额前几缕发丝随风飘扬，发丝灵动，衣袂飘飘，",
    "满头流苏装饰，层层叠叠，复杂精致，华丽璀璨，华丽轻纱，极繁主义，",
    "美人，皮肤白皙光滑，倾国倾城容貌，一位墨色长发的少女，她有着绸缎般带高光的长发，简单银饰发饰，魏晋南北朝服饰，细节丰富，光线明暗交接，（电影级面光：1.6），身材完美，" + c.morandi + "，高颜值网红，INS风，幼态脸，19岁女生尖下巴，三庭五眼比例均衡，身材娇小，细腻陶瓷水嫩肌肤，偏冷白皮，侧光，发丝轻飘，随机角度拍摄，",
    "风格甜美少女系，氛围慵懒俏皮，东方美女，黑长直，年轻娇小，发丝呈现出自然的蓬松感与垂坠感，长发散落于肩头两侧，几缕发丝拂面，冷白皮气质美女，皮肤白皙，偶像气质，气质的江南美女子，皮肤美白透亮，表情可爱，甜美氛围，构图优美，绝美角度拍摄"
  ].join("\n");
}

function buildVideoPrompt(c) {
  return "以参考图为准，人物、服装、发型、背景全程保持一致，不许换衣服、不许换色。同一位年轻东方女子，黑色长发，满头" + c.headdress + "，" + c.dress + "，" + c.background + "。10 秒，一镜到底，不切镜，固定机位。她缓慢优雅地跳舞：双臂轻抬、转身，宽袖与轻纱裙摆随动作飘起，发丝与流苏轻轻摆动，舞姿连贯，不跳跃、不换舞。写实质感，自然光线，电影感。不要字幕、旁白、logo、水印，不要换脸、换装、换背景。";
}

function renderCostumes() {
  const wrap = document.getElementById("costumes");
  wrap.innerHTML = "";
  COSTUMES.forEach(function (c) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "costume" + (c.id === selected.id ? " active" : "");
    btn.innerHTML = "<strong>" + c.name + "</strong><span>" + c.desc + "</span>";
    btn.addEventListener("click", function () {
      selected = c;
      renderCostumes();
      renderPrompts();
    });
    wrap.appendChild(btn);
  });
}

function renderPrompts() {
  document.getElementById("imagePrompt").value = buildImagePrompt(selected);
  document.getElementById("videoPrompt").value = buildVideoPrompt(selected);
}

function copyText(text, btn, label) {
  function done() {
    btn.textContent = "已复制 ✓";
    setTimeout(function () { btn.textContent = label; }, 2000);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); } catch (e) { /* ignore */ }
  document.body.removeChild(ta);
  done();
}

document.getElementById("copyImage").addEventListener("click", function () {
  copyText(document.getElementById("imagePrompt").value, this, "复制生图提示词");
});
document.getElementById("copyVideo").addEventListener("click", function () {
  copyText(document.getElementById("videoPrompt").value, this, "复制视频提示词");
});

document.getElementById("upload").addEventListener("change", function (e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    document.getElementById("portrait").src = reader.result;
    document.getElementById("portraitHint").textContent = "当前：你上传的照片（" + file.name + "）";
  };
  reader.readAsDataURL(file);
});

document.getElementById("useDemo").addEventListener("click", function () {
  document.getElementById("portrait").src = "assets/demo-purple-still.webp";
  document.getElementById("portraitHint").textContent = "当前：内置定妆图（紫色纱裙 · 已验证）";
});

document.getElementById("checklist").addEventListener("change", function () {
  const boxes = document.querySelectorAll("#checklist input[type=checkbox]");
  let checked = 0;
  boxes.forEach(function (b) { if (b.checked) checked++; });
  const left = boxes.length - checked;
  const status = document.getElementById("checkStatus");
  if (left === 0) {
    status.textContent = "全部通过 ✓ 可以去转 10 秒跳舞视频了。";
    status.classList.add("ok");
  } else {
    status.textContent = "还有 " + left + " 项没确认。";
    status.classList.remove("ok");
  }
});

renderCostumes();
renderPrompts();
