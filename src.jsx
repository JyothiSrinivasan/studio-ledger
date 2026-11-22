import React, {useMemo, useState} from 'react';
import { createRoot } from 'react-dom/client';
import {AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine} from 'recharts';
import {LayoutDashboard, Users, FileText, ArrowUpRight, ArrowDownRight, Plus, Search, MoreHorizontal, Clock3, AlertCircle, CheckCircle2, Download, ChevronDown, Send, Copy, Wallet, Palette, Menu, X, ArrowRight, TrendingUp, Paperclip, Sparkles} from 'lucide-react';
import './style.css';
const fmt=n=>new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0}).format(n)
const baseClients=[{id:1, name:'Northstar Coffee', contact:'Aarav Mehta', email:'aarav@northstar.coffee', initials:'NC', color:'#d9e8dc' ,projects:2},
    {id:2, name:'Morrow SkinCare', contact:'Rhea Kapoor', email:'rhea@morrow.in',initials:'MS', color:'#f5e1d8', projects:1},
    {id:3, name:'Fieldwork Studio', contact:'Kabir Shah', email:'kabir@fieldwork.studio', initials:'FS', color:'#e4def7', projects:1},
    {id:4, name:'Little Form Co.', contact:'Mira Iyer', email:'mira@littleform.co', initials:'LF', color:'#f3e8c9', projects:1}
]
const seed= [{
    id:'INV-028', client:'Northstar Coffee',desc:'Spring packaging - final milestone', amount:48000, issued:'12 Nov 2026', due:'18 Nov 2026', days:3, status:'Overdue', initials:'NC', color:'#d9e8dc'
},
{
    id:'INV-027', client:'Morrow SkinCare', desc:'Brand identity - phase 2', amount:72000, issued:'08 Nov 2026', due:'22 Nov 2026', days:-1, status:'Due soon', initials:'MS', color:'#f5e1d8'
},
{
    id:'INV-026', client:'Fieldwork Studio', desc:'Website design - kickoff', amount:96000, issued:'01 Nov 2026', due:'15 Nov 2026', days:6, status:'Overdue', initials:'FS', color:'#e4def7'
},
{
    id:'INV-025', client:'Little Form Co', desc:'monthly design retainer', amount:35000, issued:'25 Oct 2026', due:'24 Nov 2026', days:-3, status:'Sent', initials:'LF', color:'#f3e8c9'
}];

const payments=[{ name:'Northstar Coffee', info:'Paid - INV-024', date:'Yesterday', paidAt:'2026-11-20', amount:32000, initials:'NC', color:'#d9e8dc'},
    {name:'Little Form Co.', info:'Paid - INV-023', date:'18 Nov 2026', paidAt:'2026-11-18', amount:35000, initials:'LF', color:'#f3e8c9'},
    {name:'Morrow Skincare', info:'Paid - INV-022', date:'16 Nov 2026', paidAt:'2026-11-16', amount:54000, initials:'MS', color:'#f5e1d8'}
];
const sampleBills=[
    {
        id:1,
        name:'Studio rent',
        amount:42000,
        dueAt:'2026-11-25',
        paidAt:'',
        status:'Upcoming'
    },
    {
        id:2,
        name:'Design Software',
        amount:8500,
        dueAt:'2026-11-28',
        paidAt:'',
        status:'Upcoming'
    },
    {
        id:3,
        name:'Internet and phone',
        amount:2500,
        dueAt:'2026-11-10',
        paidAt:'2026-11-10',
        status:'Paid'
    }
];

function App(){

    const [nav, setNav]=useState('Overview'), [invoices,setInvoices]=useState(()=>{
        try{
            return JSON.parse(localStorage.getItem('studio-ledger-invoices'))||seed}
            catch{
                return seed
        }}), [clients, setClients]=useState(()=>{
            try{
                return JSON.parse(localStorage.getItem('studio-ledger-clients'))||baseClients}
                catch{
                    return baseClients
            }}), [showInvoice, setShowInvoice]=useState(false),[showClient, setShowClient]=useState(false),[selected, setSelected]=useState(null), [search, setSearch]=useState(' '),[scenario,setScenario]=useState(false),[toast,setToast]=useState(' '), [period, setPeriod]=useState('90 days'),[menu, setMenu]=useState(false);
            const[receipts,setReceipts]=useState(()=>{
                try{
                    return JSON.parse(localStorage.getItem('studio-ledger-receipts'))||payments;
                } catch{
                    return payments;
                }
            });

            const[bills,setBills]=useState(()=>{
                try{
                    return JSON.parse(localStorage.getItem('studio-ledger-bills'))||sampleBills;
                } catch{
                    return sampleBills;
                }
            });

            const[showSummary, setShowSummary]=useState(false);
            const[showBill, setShowBill]=useState(false);
            const[summaryMonth, setSummaryMonth]=useState('2026-11')
            const moneyLabel=value=> `${(value / 1000).toFixed(0)}k`;


React.useEffect(()=>{
    localStorage.setItem('studio-ledger-invoices', JSON.stringify(invoices))
},[invoices]
);

React.useEffect(()=>{
    localStorage.setItem('studio-ledger-clients',JSON.stringify(clients))
},[clients]);

React.useEffect(()=>{
    localStorage.setItem('studio-ledger-receipts',JSON.stringify(receipts));
},[receipts]);

React.useEffect(()=>{
    localStorage.setItem('studio-ledger-bills',JSON.stringify(bills));
}, [bills]);

const openToast=m=>{
    setToast(m);
    setTimeout(()=>setToast(' '),2600)
};

const lateTotal=invoices.filter(i=>i.status==='Overdue').reduce((a,b)=>a+b.amount,0);

const monthReceipts=receipts.filter(
    payment=> (payment.paidAt || '').slice(0,7) === summaryMonth
);

const collectedTotal=monthReceipts.reduce(
    (total,payment)=>total+payment.amount,
    0
);

const monthNumbers={
    Jan: '01',Feb: '02',Mar: '03',Apr: '04',
    May: '05',Jun: '06',Jul: '07',Aug: '08',
    Sep: '09',Oct: '10',Nov: '11',Dec: '12'
};

const issuedTotal=invoices
    .filter(invoice=>{
        if(invoice.issuedMonth) return invoice.issuedMonth===summaryMonth;

        const parts=(invoice.issued || '').split(' ');
        if (parts.length !==3) return false;

        return `${parts[2]}-${monthNumbers[parts[1]]}`===summaryMonth;
    })
    .reduce((total,invoice)=>total+invoice.amount,0);

const openInvoices=invoices.filter(invoice=>invoice.status!=='Paid');
const overdueInvoices=invoices.filter(invoice=>invoice.status==='Overdue');
const paidBills=bills.filter(
    bill=>(bill.paidAt|| ``).slice(0,7)===summaryMonth
);

const upcomingBills=bills.filter(
    bill=>
        bill.status!=='Paid' &&
        (bill.dueAt|| '').slice(0,7)===summaryMonth
);
const billPaidTotal=paidBills.reduce((total,bill)=>total+bill.amount,0);
const billsDueTotal=upcomingBills.reduce((total,bill)=>total+bill.amount,0);
const netCash=collectedTotal-billPaidTotal;
const monthLabel=new Date(`${summaryMonth}-01T12:00:00`).toLocaleDateString(
    'en-IN',
    {
        month:'long',year:'numeric'
    }
);

const cash=265000;
const next30DaysExpected=invoices
    .filter(invoice=> {
        if(invoice.status==='Paid') return false;

        const dueDate=new Date(invoice.due);
        const today=new Date('2026-11-21T12:00:00');
        const thirtyDaysFromNow=new Date(today);
        thirtyDaysFromNow.setDate(today.getDate()+30);

        //treat overdue invoices as expected 7days from today
        const expectedDate=dueDate<today
            ? new Date(today.getTime()+7*24*60*60*1000)
            : dueDate;

        return expectedDate<=thirtyDaysFromNow;
    })
    .reduce((total,invoice)=>total+Number(invoice.amount || 0),0);


    
const forecast=useMemo(()=> {
    const today=new Date('2026-11-21T12:00:00');

    //handles both dates like "2026-11-30" and "18 nov 2026"
    function parseDate(value){
        if (!value) return null;

        const parsed=new Date(value);
        if(!Number.isNaN(parsed.getTime())) return parsed;

        const [day,month,year]=value.split(' ');
        if(!day || !month || !year) return null;

        return new Date(`${month} ${day}, ${year} 12:00:00`);

    }

    function expectedCollectionDate(invoice, delayed) {
        const dueDate = parseDate(invoice.due);
        if(!dueDate) return null;

        //Demo assumption- overdue invoices are expected 7 days from today
        const expectedDate = dueDate< today
            ? new Date(today.getTime()+7*24*60*60*1000)
            : dueDate;

        //scenario - delay Northstar Coffee's payment by 15 days
        if(delayed && invoice.client==='Northstar Coffee'){
            expectedDate.setDate(expectedDate.getDate()+15);
        }
        return expectedDate;
    }

    function buildForecast(delayed){
        let balance=cash;
        const points=[{d:'Today',base:cash,late:cash}];

        for (let week=1;week<=12;week++){
            const weekEnd=new Date(today);
            weekEnd.setDate(today.getDate()+week*7);

            const previousWeekEnd=new Date(today);
            previousWeekEnd.setDate(today.getDate()+(week-1)*7);

            invoices.forEach(invoice=> {
                if(invoice.status==='Paid') return;

                const expectedDate=expectedCollectionDate(invoice,delayed);
                if(
                    expectedDate &&
                    expectedDate > previousWeekEnd &&
                    expectedDate <= weekEnd
                ) {
                    balance += Number(invoice.amount) || 0;
                }
            });

            bills.forEach(bill => {
                if(bill.status==='Paid')return;

                const dueDate=parseDate(bill.dueAt);
                if(
                    dueDate &&
                    dueDate > previousWeekEnd &&
                    dueDate <= weekEnd
                ) {
                    balance -= Number(bill.amount) || 0;
                }
            });

            points.push({
                d: `Wk ${week}`,
                base:balance,
                late:balance
            });
        }

        return points;
    }
    return{
            base:buildForecast(false),
            late:buildForecast(true)
        };
    }, [invoices, bills]);





const filtered=invoices.filter(x=> (x.client+x.id+x.desc).toLowerCase().includes(search.toLowerCase()));
function markPaid(id){
    const invoice=invoices.find(item=>item.id===id);
    if(invoice && invoice.status!=='Paid'){
        const paidAt=new Date().toISOString().slice(0,10);
        setReceipts(current=>[
            {
                name: invoice.client,
                info: `Paid · ${invoice.id}`,
                date: new Date().toLocaleDateString('en-IN',{
                    day:'numeric',
                    month:'short'
                }),
                paidAt,
                amount: invoice.amount,
                initials: invoice.initials,
                color: invoice.color    
            },
            ...current
        ]);
        setInvoices(current=>
            current.map(item=>
                item.id === id
                ? {...item, status:'Paid',days:0,paidAt}
                :item
            )
        );
    }
    setSelected(null);
    openToast('Payment recorded');
}
function addInvoice(e){
    e.preventDefault();
    let f=new FormData(e.target), client=f.get('client'), amount=Number(f.get('amount'));
    let cl=clients.find(c=>c.name===client)||baseClients[0];
    setInvoices(v=>[{
        id:`INV-${
            String(29+v.length-seed.length).padStart(3,'0')
        }`, client,desc:f.get('desc'),amount,issued:'21 Nov 2026', due:f.get('due'), days:-4,status:'Sent', initials:cl.initials,color:cl.color
    }, ...v]);
    setShowInvoice(false);
    openToast('Invoice Created and added to your cash plan');
}

function addClient(e){
    e.preventDefault();
    
    const form=new FormData(e.target);
    const name=form.get('name');
    const contact=form.get('contact');
    const email=form.get('email');

    const initials=name
        .split(' ')
        .map(word=>word[0])
        .join('')
        .slice(0,2)
        .toUpperCase();

    setClients(currentClients=> [
        ...currentClients,
        {
            id:Date.now(),
            name,
            contact,
            email,
            initials,
            color:'#e7e2d8',
            projects:0
        }
    ]);

    setShowClient(false);
    openToast('Client added');
}

function addBill(event){
    event.preventDefault();
    
    const form=new FormData(event.target);
    const name=form.get('name');
    const amount=Number(form.get('amount'));
    const dueAt=form.get('dueAt');
    const isPaid=form.get('status')==='Paid';

    setBills(current=>[
        {
            id:Date.now(),
            name,
            amount,
            dueAt,
            paidAt:isPaid ? new Date().toISOString().slice(0,10): '',
            status:isPaid ? 'Paid':'Upcoming'
        },
        ...current
    ]
    );

    setShowBill(false);
    setShowSummary(true);
    openToast('Bill added');
}

function markBillPaid(id){
    const paidAt=new Date().toISOString().slice(0,10);

    setBills(current=>
        current.map(bill=>
            bill.id===id?{...bill,status:'Paid',paidAt}:bill
        )
    );
    openToast('Bill payment recorded');
}

function downloadSummary(){
    const rows=[
        ['Monthly summary',moneyLabel],
        ['Collected',collectedTotal],
        ['Invoices issued',issuedTotal],
        ['Outstanding now',openInvoices.reduce((sum,item)=>sum+item.amount,0)],
        ['Overdue now',overdueInvoices.reduce((sum,item)=>sum+item.amount,0)],
        ['Bills paid',billPaidTotal],
        ['Bills still due',billsDueTotal],
        ['Net cash movement', netCash]
    ];

    const csv =rows.map(row=>row.join(',')).join('\n');
    const file=new Blob([csv],{type:'text/csv'});
    const link=document.createElement('a');
    link.href=URL.createObjectURL(file);
    link.download=`studio-ledger-${summaryMonth}-summary.csv`;
    link.click();

    URL.revokeObjectURL(link.href);

}

return <div className="app"><aside className={`sidebar ${menu?'open':''}`}>
    <div className="brand"><div className="brandmark"><Palette size={19}/></div>
    <div><b>studio ledger</b><small>YOUR BACK OFFICE</small></div>
    <button className="mobile-close" onClick={()=>setMenu(false)}><X size={17}/></button></div>
    <div className="workspace"><div className="workspace-icon">M</div>
    <div><b>Made by Mira</b><small>Freelance design studio</small></div>
    <ChevronDown size={14}/></div><p className="navlabel">WORKSPACE</p>
    <nav>{[[LayoutDashboard,'Overview'],[FileText,'Invoices'],[Users,'Clients']].map(([I,n])=><button key={n} className={`navitem ${nav===n?'active':''}`} onClick={()=>{setNav(n);setMenu(false)}}>
        <I size={18}/>{n}{n==='Invoices'&&<span className="navcount">{invoices.filter(i=>i.status!=='Paid').length}</span>}</button>)}</nav>
        <div className="side-bottom"><div className="help-card"><div className="help-icon"><Sparkles size={16}/></div>
        <b>Your money, in focus.</b><p>Know what’s coming in and what needs a nudge.</p>
        <button onClick={()=>setShowSummary(true)}>View monthly summary <ArrowRight size={13}/></button></div>
        <div className="profile"><div className="avatar mira">M</div>
        <div><b>Mira Iyer</b><small>Solo plan</small></div><MoreHorizontal size={17}/></div></div></aside>
<main className="main"><header className="topbar"><button className="hamb" onClick={()=>setMenu(!menu)}>
    <Menu/></button>
    <div className="crumb">Made by Mira <span>/</span> 
    <b>{nav}</b></div>
    <div className="top-actions"><span className="today"><span aria-hidden="true"> Sat, 21 Nov 2026</span></span>
    <button className="icon-btn" title="Download report" onClick={()=>openToast('Your cash summary is ready to export')}>
        <Download size={17}/></button><div className="avatar mira top-avatar">M</div></div></header>


{nav==='Overview'?<div className="content"><div className="greeting"><div>
    <div className="eyebrow">SATURDAY, NOVEMBER 21, 2026</div>
    <h1>A little clarity goes a long way, Mira.</h1>
    <p>Here’s where your studio’s money stands today.</p></div>
    <button className="primary" onClick={()=>setShowInvoice(true)}>
        <Plus size={17}/> New invoice</button></div>
<div className="alert-banner"><div className="alert-icon"><AlertCircle size={18}/></div>
<div className="alert-copy">
    <b>{invoices.filter(i=>i.status==='Overdue').length} invoices need a nudge today</b>
    <span>{fmt(lateTotal)} is waiting on clients. A friendly follow-up could move it along.</span></div>
    <button onClick={()=>{setNav('Invoices');openToast('Showing invoices that need a follow-up')}}>Review invoices <ArrowRight size={15}/></button>
    <button className="dismiss" onClick={e=>e.currentTarget.parentElement.remove()}><X size={16}/></button></div>

<div className="metrics"><div className="metric"><div className="metric-top"><span>Outstanding</span>
<span className="metric-icon peach"><FileText size={17}/></span></div>
<div className="metric-value">{fmt(invoices.filter(i=>i.status!=='Paid').reduce((a,b)=>a+b.amount,0))}</div>
<div className="metric-note"><span className="dot peach-dot"></span>{invoices.filter(i=>i.status==='Overdue').length} overdue <span className="muted">· {fmt(lateTotal)}</span></div></div>
<div className="metric">
    <div className="metric-top"><span>Collected this month</span>
    <span className="metric-icon mint"><ArrowDownRight size={17}/></span></div>
    <div className="metric-value">₹1,21,000</div>
    <div className="metric-note positive"><ArrowUpRight size={14}/> 18% <span className="muted">vs last month</span></div></div>
    <div className="metric"><div className="metric-top"><span>Next 30 days</span>
    <span className="metric-icon lavender"><Wallet size={17}/></span></div>
    <div className="metric-value">{fmt(next30DaysExpected)}</div>
    <div className="metric-note"><span className="dot green-dot"></span>Expected in <span className="muted">· {fmt(billsDueTotal)} bills out</span></div></div>
    <div className="metric"><div className="metric-top"><span>Cash on hand</span>
    <span className="metric-icon blue"><TrendingUp size={17}/></span></div>
    <div className="metric-value">{fmt(cash)}</div><div className="metric-note">
        <span className="dot green-dot"></span>About 2.4 months of expenses</div></div></div>
<div className="grid-main"><section className="card forecast-card">
    <div className="card-head"><div><h2>Your cash, looking ahead</h2>
    <p>Projected balance after invoices and studio bills</p></div>
    <select className="period-select" value={period} onChange={e=>setPeriod(e.target.value)}>
        <option>30 days</option><option>60 days</option>
        <option>90 days</option></select></div>
        <div className="chart-summary"><div><small>PROJECTED IN 90 DAYS</small>
        <b>{fmt(scenario ? forecast.late[12].late : forecast.base[12].base)}</b></div>
        <div className="scenario-toggle"><span>What if Northstar pays 15 days late?</span>
        <button className={`switch ${scenario?'on':''}`} onClick={()=>setScenario(!scenario)}><i/></button></div></div>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={(scenario ? forecast.late:forecast.base).slice(0,period==='30 days'?5:period==='60 days'?9:13)} margin={{top:12,right:4,bottom:0,left:-18}}><defs>
            <linearGradient id="cashfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#56816d" stopOpacity={.2}/><stop offset="95%" stopColor="#56816d" stopOpacity={.01}/></linearGradient>
            <linearGradient id="latefill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e4a66e" stopOpacity={.18}/><stop offset="95%" stopColor="#e4a66e" stopOpacity={.01}/></linearGradient></defs>
            <CartesianGrid vertical={false} stroke="#eeeae4" strokeDasharray="3 5"/><XAxis dataKey="d" tickLine={false} axisLine={false} tick={{fontSize:11,fill:'#96938c'}} interval={period==='30 days'?0:period==='60 days'?1:2}/>
            <YAxis tickFormatter={moneyLabel} tickLine={false} axisLine={false} tick={{fontSize:11,fill:'#96938c'}}/><Tooltip formatter={v=>fmt(v)} contentStyle={{borderRadius:12,border:'1px solid #eeeae4',fontSize:12}}/>
                <ReferenceLine y={100000} stroke="#d6cec0" strokeDasharray="4 4"/><Area type="monotone" dataKey={scenario?'late':'base'} stroke={scenario?'#cd8c51':'#56816d'} strokeWidth={2.5} fill={scenario?'url(#latefill)':'url(#cashfill)'} dot={false} activeDot={{r:4}}/>
                </AreaChart></ResponsiveContainer></div>
                <div className="chart-legend">
                    <span><i className="legend-dot actual"/>{scenario?'Delayed payment scenario':'Expected cash balance'}</span>
                    <span><i className="legend-line"/>Comfort buffer · ₹1L</span><button onClick={()=>setNav('Invoices')}>See cash plan <ArrowRight size={14}/></button></div></section>
<section className="card action-card"><div className="card-head"><div><h2>Needs your attention</h2>
<p>The next best thing to do</p></div>
<span className="badge-number">2</span></div>
<div className="action-list"><div className="action-item"><div className="action-pict red">
    <Clock3 size={17}/></div><div className="action-text"><b>Follow up with Northstar</b>
    <span>INV-028 · 3 days overdue</span><strong>{fmt(48000)}</strong></div>
    <button className="arrow-btn" onClick={()=>setSelected(invoices[0])}><ArrowRight size={16}/></button></div>
    <div className="action-item"><div className="action-pict amber"><Clock3 size={17}/></div>
    <div className="action-text"><b>Fieldwork is 6 days late</b>
    <span>INV-026 · A quick check-in?</span><strong>{fmt(96000)}</strong></div>
    <button className="arrow-btn" onClick={()=>setSelected(invoices[2])}><ArrowRight size={16}/></button></div></div>
    <button className="quiet-link" onClick={()=>setNav('Invoices')}>See all follow-ups <ArrowRight size={14}/></button>
    <div className="note-card"><Sparkles size={15}/>
    <p><b>A small heads-up</b><br/>If Northstar pays 15 days late, your projected balance dips below your ₹1L comfort buffer in week 5.</p>
    </div></section></div>
<div className="grid-lower"><section className="card invoices-card"><div className="card-head"><div><h2>Invoices to keep an eye on</h2>
<p>Your latest client bills</p></div>
<button className="text-button" onClick={()=>setNav('Invoices')}>All invoices <ArrowRight size={14}/></button></div>
<InvoiceTable rows={invoices.filter(i=>i.status!=='Paid').slice(0,4)} onSelect={setSelected}/></section>
<section className="card activity-card">
    <div className="card-head"><div><h2>Recent payments</h2>
    <p>Money that made it home</p></div>
    <button className="more-btn" onClick={()=>openToast('Showing recent payments')}>
        <MoreHorizontal size={18}/></button></div>
        <div className="payments">{receipts.map(p=><div className="payment" key={p.info}>
            <div className="avatar" style={{background:p.color}}>{p.initials}</div>
            <div className="payment-name"><b>{p.name}</b>
            <span>{p.info} · {p.date}</span></div><strong>+{fmt(p.amount)}</strong>
            <CheckCircle2 size={15} className="check"/></div>)}</div>
            <div className="month-total"><span>Collected in November</span>
            <b>₹1,21,000 <small>↗ 18%</small></b></div></section></div>
<div className="footer-note"><span>Numbers are based on your invoices and bills.</span>
<button onClick={()=>openToast('Forecast assumptions: invoices arrive on their due date; bills are scheduled manually.')}>How we estimate <ArrowRight size={13}/></button></div></div>:nav==='Invoices'?
<div className="content">
    <div className="greeting">
        <div>
            <div className="eyebrow">YOUR MONEY, IN MOTION</div>
            <h1>Invoices</h1>
            <p>Keep the work moving and the payments coming.</p>
            </div>
            <button className="primary" onClick={()=>setShowInvoice(true)}><Plus size={17}/> New invoice</button></div>
            <div className="invoice-stats"><div><small>OUTSTANDING</small>
            <b>{fmt(invoices.filter(i=>i.status!=='Paid').reduce((a,b)=>a+b.amount,0))}</b></div>
            <div><small>OVERDUE</small><b className="redtext">{fmt(lateTotal)}</b></div>
            <div><small>PAID THIS MONTH</small>
            <b>₹1,21,000</b></div></div>
            <section className="card full-invoices">
                <div className="table-toolbar"><div><h2>All invoices <span className="subtle">{invoices.length}</span></h2>
                <p>Track what’s sent, due and paid.</p></div>
                <div className="table-tools"><div className="search">
                    <Search size={15}/><input placeholder="Search invoices" value={search} onChange={e=>setSearch(e.target.value)}/></div>
                    <button className="filter-btn" onClick={()=>openToast('Showing all invoice statuses')}>All status <ChevronDown size={14}/></button></div></div>
                    <InvoiceTable rows={filtered} onSelect={setSelected} large/></section>
                    <div className="bottom-tip"><Sparkles size={16}/><span>
                        <b>Make follow-ups feel easy.</b> Open any invoice to draft a kind, clear reminder you can copy and send.</span></div></div>:<div className="content">
                            <div className="greeting"><div><div className="eyebrow">YOUR CREATIVE PARTNERS</div>
                            <h1>Clients</h1>
                            <p>Good work starts with good relationships.</p></div>
                            <button className="primary" onClick={()=>setShowClient(true)}><Plus size={17}/> Add client</button></div>
                            <div className="client-grid">{clients.map(c=><div className="card client-card" key={c.id}>
                                <div className="client-head"><div className="avatar big" style={{background:c.color}}>{c.initials}</div>
                                <button className="more-btn" onClick={()=>openToast(`Client: ${c.name}`)}><MoreHorizontal size={17}/></button></div>
                                <h3>{c.name}</h3><p>{c.contact}</p>
                                <div className="client-email">{c.email}</div>
                                <div className="client-bottom"><span>{c.projects} active {c.projects===1?'project':'projects'}</span>
                                <button onClick={()=>{setNav('Invoices');setSearch(c.name)}}>View invoices <ArrowRight size={13}/></button></div></div>)}</div>
                                <div className="client-hint"><Sparkles size={16}/>
                                <span>Keep client details lightweight. Name, email and project are enough to get started.</span></div></div>}</main>
{selected&&<div className="overlay" onClick={()=>setSelected(null)}>
    <div className="drawer" onClick={e=>e.stopPropagation()}>
        <div className="drawer-top">
            <div className="eyebrow">INVOICE DETAILS</div>
            <button className="more-btn" onClick={()=>setSelected(null)}><X size={18}/></button></div>
            <div className="invoice-number">{selected.id}<span className={`status ${selected.status==='Overdue'?'overdue':selected.status==='Due soon'?'soon':'sent'}`}>{selected.status}</span></div>
            <h2>{selected.client}</h2><p className="drawer-desc">{selected.desc}</p>
            <div className="drawer-amount">{fmt(selected.amount)}<small>Invoice total</small></div>
            <div className="detail-rows"><div><span>Issued</span>
            <b>{selected.issued}</b></div>
            <div><span>Due date</span><b>{selected.due}</b></div>
            <div><span>Payment terms</span><b>Net 14</b></div>
            <div><span>Payment method</span><b>Bank transfer</b></div></div>{selected.status!=='Paid'&&<div className="reminder">
                <div className="reminder-head">
                    <div className="metric-icon lavender">
                        <Sparkles size={16}/>
                        </div>
                        <div><b>A gentle nudge, ready to go</b>
                        <span>Drafted for {selected.client.split(' ')[0]}</span></div></div>
                        <p>Hi {selected.client==='Northstar Coffee'?'Aarav':selected.client==='Fieldwork Studio'?'Kabir':'there'}, just checking in on invoice {selected.id} for {fmt(selected.amount)}. It was due on {selected.due}. Could you let me know when I can expect payment? Happy to resend the details if helpful. Thanks, Mira</p>
                        <div className="reminder-actions">
                            <button className="outline-btn" onClick={()=>{navigator.clipboard?.writeText(`Hi! Just checking in on ${selected.id} for ${fmt(selected.amount)}. Could you let me know when I can expect payment? Thanks, Mira.`);openToast('Reminder copied to clipboard')}}><Copy size={14}/> Copy message</button>
                            <button className="primary small-primary" onClick={()=>openToast('Reminder marked as sent')}>
                                <Send size={14}/> Mark sent</button></div></div>}<div className="drawer-bottom">{selected.status!=='Paid'&&<button className="markpaid" onClick={()=>markPaid(selected.id)}>
                                    <CheckCircle2 size={16}/> Mark as paid</button>}<button className="outline-btn" onClick={()=>openToast('Invoice PDF prepared for download')}>
                                        <Download size={14}/> Download invoice</button></div></div></div>}

{showSummary && (
    <div className="overlay" onClick={()=>setShowSummary(false)}>
        <div className="modal summary-modal" onClick={event=>event.stopPropagation()}>
            <div className="modal-head">
                <div>
                    <div className="eyebrow">MONTH-END VIEW</div>
                    <h2> Monthly cash summary</h2>
                    <p> Recorded activity for {monthLabel}. Outstanding amounts are as of today.</p>
                </div>
                <button className="more-btn" onClick={()=>setShowSummary(false)}>
                    <X size={18} />
                </button>
            </div>
            <div className="summary-toolbar">
                <label>
                    Choose month
                    <input
                    type="month"
                    value={summaryMonth}
                    onChange={event=> setSummaryMonth(event.target.value)}/>
                </label>
                <button className="outline-btn" onClick={downloadSummary}>
                    <Download size={14}/> Download CSV
                </button>
            </div>
            <div className="summary-grid">
                <div className="summary-stat">
                    <small>COLLECTED</small>
                    <b>{fmt(collectedTotal)}</b>
                    <span> Payments recorded in {monthLabel}</span>
                </div>

                <div className="summary-stat">
          <small>INVOICES ISSUED</small>
          <b>{fmt(issuedTotal)}</b>
          <span>Invoice value issued this month</span>
        </div>

        <div className="summary-stat">
          <small>OUTSTANDING NOW</small>
          <b>{fmt(openInvoices.reduce((sum, item) => sum + item.amount, 0))}</b>
          <span>{openInvoices.length} unpaid invoices</span>
        </div>

        <div className="summary-stat warning-stat">
          <small>OVERDUE NOW</small>
          <b>{fmt(overdueInvoices.reduce((sum, item) => sum + item.amount, 0))}</b>
          <span>{overdueInvoices.length} invoices need attention</span>
        </div>

        <div className="summary-stat">
          <small>BILLS PAID</small>
          <b>{fmt(billPaidTotal)}</b>
          <span>{paidBills.length} bills paid in {monthLabel}</span>
        </div>

        <div className="summary-stat">
          <small>BILLS STILL DUE</small>
          <b>{fmt(billsDueTotal)}</b>
          <span>{upcomingBills.length} bills due this month</span>
        </div>
      </div>

      <div className="summary-net">
        <span>Net cash movement <small>(collected minus bills paid)</small></span>
        <b>{fmt(netCash)}</b>
      </div>

      <div className="summary-next">
        <Sparkles size={16} />
        <span>
          <b>Suggested next step</b><br />
          {overdueInvoices.length
            ? `Follow up on ${overdueInvoices.length} overdue invoice(s) worth ${fmt(
                overdueInvoices.reduce((sum, item) => sum + item.amount, 0)
              )}.`
            : 'No overdue invoices right now. Check upcoming bills before month end.'}
        </span>
      </div>

      <div className="summary-bills-head">
        <h3>Bills for {monthLabel}</h3>
        <button
          className="text-button"
          onClick={() => {
            setShowSummary(false);
            setShowBill(true);
          }}
        >
          <Plus size={14} /> Add bill
        </button>
      </div>

      {bills
        .filter(bill => (bill.dueAt || '').slice(0, 7) === summaryMonth)
        .map(bill => (
          <div className="summary-bill" key={bill.id}>
            <span>
              <b>{bill.name}</b>
              <small>Due {bill.dueAt}</small>
            </span>
            <strong>{fmt(bill.amount)}</strong>
            {bill.status === 'Paid' ? (
              <i className="status paid">Paid</i>
            ) : (
              <button className="outline-btn" onClick={() => markBillPaid(bill.id)}>
                Mark paid
              </button>
            )}
          </div>
        ))}

      <p className="summary-footnote">
        Based on entries in this browser. Unrecorded payments and expenses are not included.
      </p>
    </div>
  </div>
)}

{showBill && (
  <div className="overlay" onClick={() => setShowBill(false)}>
    <div className="modal" onClick={event => event.stopPropagation()}>
      <div className="modal-head">
        <div>
          <div className="eyebrow">MONEY GOING OUT</div>
          <h2>Add a business bill</h2>
          <p>Record a bill so it appears in the monthly summary.</p>
        </div>
        <button className="more-btn" onClick={() => setShowBill(false)}>
          <X size={18} />
        </button>
      </div>

      <form onSubmit={addBill}>
        <label>
          Bill name
          <input name="name" required placeholder="e.g. Studio rent" />
        </label>

        <div className="form-row">
          <label>
            Amount
            <input name="amount" required type="number" min="1" placeholder="₹ 0" />
          </label>
          <label>
            Due date
            <input name="dueAt" required type="date" />
          </label>
        </div>

        <label>
          Status
          <select name="status">
            <option>Upcoming</option>
            <option>Paid</option>
          </select>
        </label>

        <button className="primary submit" type="submit">
          Save bill <ArrowRight size={15} />
        </button>
      </form>
    </div>
  </div>
)}



{(showInvoice||showClient)&&<div className="overlay" onClick={()=>{setShowInvoice(false);setShowClient(false)}}>
    <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-head"><div>
            <div className="eyebrow">{showInvoice?'GET PAID, SIMPLY':'GROW YOUR STUDIO'}</div>
            <h2>{showInvoice?'Create an invoice':'Add a client'}</h2>
            <p>{showInvoice?'A few details and you’re ready to send.':'Save the essentials. You can add the rest later.'}</p></div>
            <button className="more-btn" onClick={()=>{setShowInvoice(false);setShowClient(false)}}><X size={18}/></button></div>{showInvoice?<form onSubmit={addInvoice}>
                <label>Client<select required name="client"><option value="">Choose a client</option>{clients.map(c=><option key={c.id}>{c.name}</option>)}</select></label>
                <label>What’s the work?<input name="desc" required placeholder="e.g. Brand identity · final milestone"/></label>
                <div className="form-row">
                    <label>Amount<input name="amount" required type="number" min="1" placeholder="₹ 0"/></label>
                    <label>Due date<input name="due" required type="date" defaultValue="2026-12-05"/></label></div>
                    <div className="form-note"><Sparkles size={15}/> We’ll include this in your cash forecast automatically.</div>
                    <button className="primary submit" type="submit">Create invoice <ArrowRight size={15}/></button></form>:<form onSubmit={addClient}>
                        <label>Client or business name<input name="name" required placeholder="e.g. Northstar Coffee"/></label>
                        <label>Contact person<input name="contact" required placeholder="e.g. Aarav Mehta"/></label>
                        <label>Email address<input name="email" required type="email" placeholder="name@business.com"/></label>
                        <button className="primary submit" type="submit">Add client <ArrowRight size={15}/></button></form>}</div></div>}
{toast&&<div className="toast">
    <CheckCircle2 size={17}/>{toast}</div>}
    </div>}
function InvoiceTable({rows,onSelect,large=false}){
    return(
    <div className={`invoice-table ${large?'large':''}`}>
        <div className="table-row table-labels">
            <span>CLIENT / INVOICE</span>
            <span>AMOUNT</span>
            <span>DUE DATE</span>
            <span>STATUS</span>
            <span></span></div>{rows.map(r=><button className="table-row invoice-row" key={r.id} onClick={()=>onSelect(r)}>
                <span className="client-cell"><span className="avatar" style={{background:r.color}}>{r.initials}</span>
                <span><b>{r.client}</b><small>{r.id} · {r.desc}
                    </small></span></span>
                    <strong>{fmt(r.amount)}</strong>
                    <span className="date-cell">{r.due}{r.status==='Overdue'&&<small>{r.days} days late</small>
                    }
                    </span>
                    <span><i className={`status ${r.status==='Overdue'?'overdue':r.status==='Due soon'?'soon':r.status==='Paid'?'paid':'sent'}`}>{r.status}</i></span>
                    <MoreHorizontal size={17} className="row-more"/></button>)}</div>
                    );
                }
createRoot(document.getElementById('root')).render(<App/>);




