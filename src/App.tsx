import { useState } from 'react'
import { Activity, Bot, Box, ChevronDown, CircleHelp, Cloud, Code2, Cpu, FolderOpen, Gamepad2, Globe2, Layers3, Menu, Play, Send, Settings, ShieldCheck, Sparkles, WandSparkles, X } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; text: string }

const starterPrompt = 'Create a complete 3D open-world zombie survival game called BlightFall. Start by producing a practical development plan and a playable vertical slice for Godot 4. Include a third-person player, one small test area, one zombie with basic AI, health, hunger, thirst, inventory, and save/load. Use placeholder assets where generated 3D assets are not yet available. Keep the project modular and optimized for Android and PC.'

const nav = [
  { label: 'لوحة التحكم', icon: Gamepad2, active: true },
  { label: 'منشئ الألعاب بالذكاء الاصطناعي', icon: WandSparkles },
  { label: 'مولّد مجسمات 3D', icon: Box },
  { label: 'باني العوالم والخرائط', icon: Globe2 },
  { label: 'الشخصيات والأنيميشن', icon: Layers3 },
  { label: 'مشاريع Godot', icon: FolderOpen },
  { label: 'المعاينة والاختبار', icon: Play },
  { label: 'الإعدادات والربط', icon: Settings },
]

export default function App() {
  const [prompt, setPrompt] = useState(starterPrompt)
  const [messages, setMessages] = useState<Message[]>([])
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [mobileNav, setMobileNav] = useState(false)

  async function sendPrompt() {
    const text = prompt.trim()
    if (!text || busy) return
    setMessages(m => [...m, { role: 'user', text }])
    setPrompt('')
    setBusy(true)
    setNotice('')
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'تعذر الاتصال بخدمة الذكاء الاصطناعي')
      setMessages(m => [...m, { role: 'assistant', text: data.text || 'لم يصل رد نصي.' }])
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'حدث خطأ غير معروف'
      setNotice(msg + ' — تأكد من إعداد GEMINI_API_KEY في Cloudflare Pages.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="app-shell" dir="rtl">
    <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><Gamepad2 size={23}/></div>
        <div><strong>BLIGHTFALL</strong><span>AI GAME STUDIO</span></div>
        <button className="icon-btn close-nav" onClick={() => setMobileNav(false)} aria-label="إغلاق القائمة"><X size={18}/></button>
      </div>
      <button className="new-project"><Sparkles size={17}/> مشروع جديد</button>
      <div className="nav-caption">مساحة العمل</div>
      <nav>{nav.map((item, i) => <button key={item.label} className={`nav-item ${item.active ? 'selected' : ''}`} onClick={() => i !== 0 && setNotice('هذا القسم ضمن مراحل التطوير التالية.')}>
        <item.icon size={18}/><span>{item.label}</span>{i === 1 && <span className="soon">AI</span>}
      </button>)}</nav>
      <div className="sidebar-bottom">
        <div className="cloud-status"><span className="status-dot"></span><div><b>الاستوديو السحابي</b><small>واجهة أولية — الربط قيد الإعداد</small></div></div>
        <div className="user-row"><div className="avatar">BF</div><div><b>BlightFall Studio</b><small>مساحة العمل الخاصة</small></div><ChevronDown size={15}/></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div className="top-left"><button className="icon-btn menu-btn" onClick={() => setMobileNav(true)} aria-label="فتح القائمة"><Menu/></button><span className="crumb">مساحة العمل <b>/</b> لوحة التحكم</span></div>
        <div className="top-actions"><span className="connection"><i></i> واجهة الاستوديو</span><button className="icon-btn" aria-label="المساعدة"><CircleHelp size={18}/></button></div>
      </header>

      <section className="content">
        <div className="welcome-row">
          <div><div className="eyebrow"><span></span> AI-POWERED GAME DEVELOPMENT</div><h1>حوّل فكرتك إلى <em>عالم قابل للعب.</em></h1><p>استوديو تطوير ألعاب ثلاثية الأبعاد بمساعدة الذكاء الاصطناعي.</p></div>
          <div className="hero-icon"><Cpu size={35}/><span></span></div>
        </div>

        <div className="notice info"><ShieldCheck size={18}/><span><b>نسخة تأسيسية:</b> الواجهة جاهزة للربط. إنشاء ملفات Godot وتشغيل خوادم 3D السحابية لم يُفعّل بعد.</span></div>
        {notice && <div className="notice warning"><Activity size={18}/><span>{notice}</span></div>}

        <div className="section-heading"><div><h2>ابدأ ببناء لعبتك</h2><p>اكتب طلبك، وسيحوّله Gemini إلى خطة تطوير قابلة للتنفيذ.</p></div><span className="model-tag"><Sparkles size={14}/> Gemini API</span></div>
        <div className="prompt-card">
          <div className="prompt-head"><div><WandSparkles size={18}/><b>AI Game Creator</b></div><span>وصف المشروع</span></div>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="صف اللعبة التي تريد إنشاءها..." rows={7}/>
          <div className="prompt-footer"><span>نصيحة: ابدأ بنموذج لعب صغير ثم وسّعه تدريجياً.</span><button className="primary-btn" onClick={sendPrompt} disabled={busy || !prompt.trim()}>{busy ? <span className="spinner"/> : <Send size={16}/>} {busy ? 'جارٍ التفكير...' : 'إرسال إلى Gemini'}</button></div>
        </div>

        {messages.length > 0 && <div className="response-panel">
          <div className="section-heading"><div><h2>محادثة وكيل التطوير</h2><p>ردود Gemini — هذه المرحلة تخطيط ومساعدة نصية.</p></div><Bot size={20}/></div>
          {messages.map((m, i) => <div key={i} className={`message ${m.role}`}><b>{m.role === 'user' ? 'أنت' : 'Gemini — مساعد التطوير'}</b><p>{m.text}</p></div>)}
        </div>}

        <div className="section-heading tools-heading"><div><h2>أدوات الاستوديو</h2><p>ستُفعّل هذه الوحدات تدريجياً بعد تجهيز الخوادم.</p></div></div>
        <div className="tool-grid">
          <Tool icon={<Box/>} title="مولّد مجسمات 3D" desc="إنشاء أصول ثلاثية الأبعاد من النص أو الصور." state="قيد التجهيز"/>
          <Tool icon={<Globe2/>} title="باني العالم" desc="تخطيط المناطق والتضاريس والبيئات." state="قيد التجهيز"/>
          <Tool icon={<Code2/>} title="Godot + MCP" desc="إنشاء المشاهد والسكربتات والتحكم بالمحرّك." state="قيد التجهيز"/>
          <Tool icon={<Play/>} title="المعاينة والاختبار" desc="تشغيل البناء واختبار المشاهد واكتشاف الأخطاء." state="قيد التجهيز"/>
        </div>
        <footer><span>BLIGHTFALL AI STUDIO</span><span>إصدار تأسيسي 0.1.0 · مفتوح المصدر</span></footer>
      </section>
    </main>
    {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="إغلاق القائمة"/>}
  </div>
}

function Tool({icon, title, desc, state}: {icon: React.ReactNode, title: string, desc: string, state: string}) {
  return <div className="tool-card"><div className="tool-icon">{icon}</div><div className="tool-copy"><b>{title}</b><p>{desc}</p><small>{state}</small></div></div>
}
