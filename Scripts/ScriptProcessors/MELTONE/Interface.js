Content.makeFrontInterface(1350, 900);

// 페이지 상태: 0 = 메인, 1 = 시퀀스, 2 = 세팅
reg currentPage = 0;

// ========== 페이지 패널 ==========
const pageMain    = Content.getComponent("pageMain");
const pageSeq     = Content.getComponent("pageSeq");
const pageSetting = Content.getComponent("pageSetting");

// ========== 버튼 ==========
const btnToggleSeq = Content.getComponent("btnTogglePage"); // 시퀀서 전환 버튼
const btnToggleSet = Content.getComponent("btnToggleSet");  // 세팅 전환 버튼

// ========== 파형 노브 ==========
const waveKnob2   = Content.getComponent("waveKnob2");
const waveformMap = [1, 3, 6, 7, 5];

// ========== 페이지 전환 함수 ==========

const btnInstagram = Content.getComponent("btnInstagram");
const btnYouTube = Content.getComponent("btnYouTube");
const btnWebsite = Content.getComponent("btnWebsite");



inline function onInstagramClick(component, value) {
    if (value)
        Engine.openWebsite("https://instagram.com/gillatrack");
}

inline function onYouTubeClick(component, value) {
    if (value)
        Engine.openWebsite("https://open.spotify.com/album/4YU2VBLrCrjaMCnSecEEWl?si=TO54np39RKWhvE7tu2Q-Jw");
}

inline function onWebsiteClick(component, value) {
    if (value)
        Engine.openWebsite("https://quietformat.com");
}

// 콜백 연결
btnInstagram.setControlCallback(onInstagramClick);
btnYouTube.setControlCallback(onYouTubeClick);
btnWebsite.setControlCallback(onWebsiteClick);


inline function setPage(pageIndex)
{
    pageMain.set("visible", pageIndex == 0);
    pageSeq.set("visible", pageIndex == 1);
    pageSetting.set("visible", pageIndex == 2);

    currentPage = pageIndex;

    // 버튼 텍스트 갱신
    if (pageIndex == 0)
    {
        btnToggleSeq.set("text", "Go to Sequencer");
        btnToggleSet.set("text", "Go to Settings");
    }
    else if (pageIndex == 1)
    {
        btnToggleSeq.set("text", "Back to Main");
        btnToggleSet.set("text", "Go to Settings");
    }
    else if (pageIndex == 2)
    {
        btnToggleSeq.set("text", "Go to Sequencer");
        btnToggleSet.set("text", "Back to Main");
    }
}

// ========== 버튼 콜백 ==========
inline function onToggleSeqClick(c, v)
{
    if (currentPage == 0)
        setPage(1); // Main → Seq
    else
        setPage(0); // Seq or Setting → Main
}

inline function onToggleSetClick(c, v)
{
    if (currentPage == 2)
        setPage(0); // Setting → Main
    else
        setPage(2); // Main or Seq → Setting
}

btnToggleSeq.setControlCallback(onToggleSeqClick);
btnToggleSet.setControlCallback(onToggleSetClick);

// ========== 파형 노브 콜백 ==========
inline function onOsc2WaveChange(c, value)
{
    local mapped = waveformMap[value - 1];
    Console.print("Setting Waveform2 to: " + mapped);
    Synth.setAttribute("Waveform Generator1.WaveForm2", mapped);
}

waveKnob2.set("mode", "Integer");
waveKnob2.set("min", 1);
waveKnob2.set("max", 5);
waveKnob2.set("stepSize", 1);
waveKnob2.setControlCallback(onOsc2WaveChange);

// ========== 초기 페이지 설정 ==========
setPage(0); 

function onNoteOn()
{
	
}
 function onNoteOff()
{
	
}
 function onController()
{
	
}
 function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 