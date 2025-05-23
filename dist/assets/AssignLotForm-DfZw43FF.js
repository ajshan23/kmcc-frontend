import{d as R,u as k,r,j as e,T as j}from"./index-DZiXj8TR.js";import{a as F}from"./api-CQpZrRPq.js";import{P as q}from"./PageTitle-DsU_ZpA0.js";import{I as z}from"./IconifyIcon-BSqbF420.js";import{A as E}from"./Alert-BfDUL-vw.js";import{B as h}from"./Button-BxiFzc-j.js";import{R as H,C as G}from"./Row-DDbPR_EX.js";import{C as A}from"./Card-CSmnExEW.js";import{F as p}from"./Form-BpKd490-.js";import{I as M}from"./InputGroup-DSWqMoZW.js";import{S as L}from"./Spinner-lK2R0e8p.js";import"./iconify-DkiI8ZpJ.js";import"./hook-MPOcAf8c.js";import"./extends-CF3RwP-h.js";import"./divWithClassName-BB-OH6fM.js";import"./Anchor-DT6C7PiC.js";import"./useEventCallback-DiaRCx7D.js";import"./Button-DamFSoRp.js";import"./CardHeaderContext-DtkFU5Q_.js";import"./FormCheck-uCRPbm19.js";import"./FormContext-52DUx_Tc.js";import"./ElementChildren-UnnKUi4O.js";import"./FormControl-CYWbfcub.js";import"./FormLabel-DPx4Bcny.js";import"./InputGroupContext-B_HTUhiE.js";const xe=()=>{const{programId:f}=R(),g=k(),[b,y]=r.useState([]),[o,m]=r.useState({users:!1,submit:!1}),[B,d]=r.useState(!1),[U,x]=r.useState(""),[v,N]=r.useState(null),[n,S]=r.useState(""),[t,I]=r.useState(null),[c,w]=r.useState({userId:"",programId:f});r.useEffect(()=>{const s=async()=>{var l,a,T,C;try{m(P=>({...P,users:!0})),N(null);const i=await F.get(`/admin/users?search=${n}`);if(!((a=(l=i.data)==null?void 0:l.data)!=null&&a.users))throw new Error("Invalid users data structure");y(i.data.data.users)}catch(i){console.error("Error fetching users:",i),N(((C=(T=i.response)==null?void 0:T.data)==null?void 0:C.message)||i.message||"Failed to load users")}finally{m(i=>({...i,users:!1}))}},u=setTimeout(()=>{n.trim()!==""?s():y([])},500);return()=>clearTimeout(u)},[n]);const $=async s=>{var u,l;if(s.preventDefault(),!c.userId){x("Please select a user"),d(!0);return}m(a=>({...a,submit:!0}));try{await F.post("/gold/lots",c),x("Lot assigned successfully!"),d(!0),setTimeout(()=>g(`/gold-programs/${f}/lots`),1500)}catch(a){x(((l=(u=a.response)==null?void 0:u.data)==null?void 0:l.message)||"Failed to assign lot"),d(!0)}finally{m(a=>({...a,submit:!1}))}},D=s=>{I(s),w({...c,userId:s.id}),S(`${s.name} (${s.memberId})`)};return v?e.jsxs(E,{variant:"danger",className:"my-4",children:[e.jsx(E.Heading,{children:"Error loading users"}),e.jsx("p",{children:v}),e.jsx(h,{variant:"primary",onClick:()=>window.location.reload(),children:"Retry"})]}):e.jsxs(e.Fragment,{children:[e.jsx(q,{title:"Assign New Lot"}),e.jsx(H,{children:e.jsx(G,{md:6,children:e.jsx(A,{children:e.jsx(A.Body,{children:e.jsxs(p,{onSubmit:$,children:[e.jsxs(p.Group,{className:"mb-3",children:[e.jsx(p.Label,{children:"Search User"}),e.jsxs(M,{children:[e.jsx(p.Control,{type:"text",placeholder:"Search by name, member ID or iqama",value:n,onChange:s=>{S(s.target.value),s.target.value===""&&(I(null),w({...c,userId:""}))},disabled:o.submit}),e.jsx(h,{variant:"outline-secondary",disabled:o.users||o.submit,children:o.users?e.jsx(L,{size:"sm",animation:"border"}):e.jsx(z,{icon:"mdi:magnify"})})]}),n&&b.length>0&&e.jsx("div",{className:"mt-2 border rounded p-2",style:{maxHeight:"200px",overflowY:"auto"},children:b.map(s=>e.jsxs("div",{className:`p-2 cursor-pointer ${(t==null?void 0:t.id)===s.id?"bg-light":""}`,onClick:()=>D(s),children:[e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsx("span",{children:s.name}),e.jsx("small",{className:"text-muted",children:s.memberId})]}),e.jsx("small",{className:"text-muted",children:s.iqamaNumber})]},s.id))})]}),t&&e.jsxs("div",{className:"mb-3 p-3 bg-light rounded",children:[e.jsx("h6",{children:"Selected User:"}),e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsx("span",{children:t.name}),e.jsx("span",{className:"text-muted",children:t.memberId})]}),e.jsx("div",{className:"text-muted small",children:t.iqamaNumber}),e.jsx("div",{className:"text-muted small",children:t.phoneNumber})]}),e.jsxs("div",{className:"d-flex gap-2",children:[e.jsx(h,{variant:"secondary",onClick:()=>g(-1),disabled:o.submit,children:"Cancel"}),e.jsx(h,{type:"submit",variant:"primary",disabled:o.submit||!t,children:o.submit?e.jsxs(e.Fragment,{children:[e.jsx(L,{size:"sm",animation:"border",className:"me-2"}),"Assigning..."]}):"Assign Lot"})]})]})})})})}),e.jsxs(j,{onClose:()=>d(!1),show:B,delay:3e3,autohide:!0,style:{position:"fixed",top:20,right:20,zIndex:9999},children:[e.jsx(j.Header,{closeButton:!1,children:e.jsx("strong",{className:"me-auto",children:"Notification"})}),e.jsx(j.Body,{children:U})]})]})};export{xe as default};
