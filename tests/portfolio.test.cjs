const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
// Use the project's existing TypeScript compiler; no extra test dependency.
for(const extension of ['.ts','.tsx'])require.extensions[extension]=(module,filename)=>{
 const output=ts.transpileModule(fs.readFileSync(filename,'utf8'),{fileName:filename,compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,esModuleInterop:true}});
 module._compile(output.outputText,filename);
};
const {videoSource}=require('../lib/video.ts');
const {validateInquiry,validService,SERVICES}=require('../lib/inquiry.ts');
const {NextRequest}=require('next/server');
const {POST}=require('../app/api/inquiry/route.ts');
const valid={name:'A real visitor',email:'visitor@example.com',phone:'+389 70 123 456',service:'commercial-video',date:'2027-04-12',location:'Skopje',budget:'€500–€1000',message:'A video project for our product launch.',website:''};
const request=(body,origin='https://frames.andrejjovanovski.dev')=>new NextRequest('https://frames.andrejjovanovski.dev/api/inquiry',{method:'POST',headers:{origin,'content-type':'application/json'},body:typeof body==='string'?body:JSON.stringify(body)});

test('video URLs use trusted embed origins and retain Vimeo unlisted hashes',()=>{
 assert.equal(videoSource('https://youtu.be/dQw4w9WgXcQ?t=12').src,'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0');
 assert.equal(videoSource('https://www.youtube.com/shorts/dQw4w9WgXcQ').kind,'youtube');
 assert.equal(videoSource('https://vimeo.com/123456789/abc123').src,'https://player.vimeo.com/video/123456789?dnt=1&h=abc123');
 assert.equal(videoSource('https://player.vimeo.com/video/123456789?h=abc123').kind,'vimeo');
 assert.equal(videoSource('https://cdn.example.com/film.mp4?token=abc').kind,'file');
 for(const url of ['javascript:alert(1)','http://youtube.com/watch?v=dQw4w9WgXcQ','https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ','https://youtube.com/watch?v=bad','https://evil.test/embed/123','https://user:password@cdn.example.com/file.mp4'])assert.equal(videoSource(url),null);
});
test('all eight service IDs are validated and query values cannot become arbitrary services',()=>{
 assert.equal(SERVICES.length,8);for(const service of SERVICES)assert.equal(validService(service.id),true);
 for(const value of [undefined,'',[],['commercial-video'],'<script>','commercial-video<script>'])assert.equal(validService(value),false);
});
test('inquiry validation trims values, validates required fields, dates and limits',()=>{
 const result=validateInquiry({...valid,name:'  A real visitor  '});assert.equal(result.valid,true);assert.equal(result.data.name,'A real visitor');
 for(const [field,value]of Object.entries({name:' ',email:'bad-address',service:'forged',date:'2027-02-31',phone:'x'.repeat(51),location:'x'.repeat(201),budget:'x'.repeat(101),message:'x'.repeat(5001)}))assert.ok(validateInquiry({...valid,[field]:value}).errors[field],field);
 assert.equal(validateInquiry({...valid,phone:'',date:'',location:'',budget:''}).valid,true);
 assert.equal(validateInquiry({...valid,website:'https://spam.example'}).valid,false);
});
test('server rejects invalid, cross-origin, malformed, oversized and honeypot submissions before forwarding',async()=>{
 const original=global.fetch;let calls=0;global.fetch=async()=>{calls++;throw Error('should not forward')};
 try{
  assert.equal((await POST(request({...valid,email:'invalid'}))).status,422);
  assert.equal((await POST(request(valid,'https://other.example'))).status,403);
  assert.equal((await POST(request('{invalid'))).status,400);
  assert.equal((await POST(request({...valid,message:'x'.repeat(17000)}))).status,413);
  assert.equal((await POST(request({...valid,website:'bot'}))).status,422);
  assert.equal(calls,0);
 }finally{global.fetch=original;}
});
test('server forwards validated fields to the existing Formspree form and requires confirmed acceptance',async()=>{
 const original=global.fetch;let forwarded;
 try{
  global.fetch=async(url,options)=>{assert.equal(url,'https://formspree.io/f/mzeegbel');forwarded=JSON.parse(options.body);return Response.json({ok:true})};
  const result=await POST(request(valid));assert.equal(result.status,200);assert.equal((await result.json()).ok,true);
  assert.equal(forwarded.service,'Commercial Video Production');assert.equal(forwarded.date,valid.date);assert.equal(forwarded.budget,valid.budget);assert.equal(forwarded.email,valid.email);
  global.fetch=async()=>Response.json({ok:false});assert.equal((await POST(request(valid))).status,502);
  global.fetch=async()=>Response.json({error:'rate limit'},{status:429});assert.equal((await POST(request(valid))).status,429);
  global.fetch=async()=>{throw Error('network unavailable')};assert.equal((await POST(request(valid))).status,502);
 }finally{global.fetch=original;}
});
test('Sanity film and commercial schemas compile alongside the existing photo schemas',()=>{
 const {Schema}=require('@sanity/schema');const {schemaTypes}=require('../sanity/schemaTypes/index.ts');
 const schema=Schema.compile({name:'portfolio-tests',types:schemaTypes});
 for(const name of ['photo','collection','category','heroSlide','siteSettings','projectImage','film','commercialProject'])assert.ok(schema.get(name),name);
});
test('project pages render real film details, spec-work labels, galleries, and honest empty states',async()=>{
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
 const portfolio=require('../lib/portfolio.ts'),sanity=require('../lib/sanity.ts');
 const oldProjects=portfolio.getProjects,oldSite=sanity.getSiteContent;
 const {default:Page,portfolioMetadata}=require('../components/PortfolioPage.tsx');
 const fixture={id:'fixture',slug:'test-film',title:'A test film',description:'A genuine synopsis supplied by its creator.',category:'Narrative Short Films',categoryId:'narrative-short-films',cover:'/icon.png',coverAlt:'Test poster',featured:true,year:2026,runtime:'04:32',creator:'Andrej',videoUrl:'https://vimeo.com/123456789/abc123',synopsis:'The complete synopsis.',production:'Real production notes.',technical:'Actual camera notes.',notes:'Lighting notes.',services:['Photography'],deliverables:['Final photographs'],credits:[{role:'Director',name:'Andrej'}],images:[{src:'/icon.png',title:'Film still',type:'',width:512,height:512}],behindScenes:[{src:'/icon.png',title:'Lighting setup',type:'',width:512,height:512}],projectType:'spec',client:'Do not claim this is a client'};
 try{
  sanity.getSiteContent=async()=>({settings:{},gallery:[],collections:[],slides:[],categories:[]});portfolio.getProjects=async()=>[fixture,{...fixture,id:'related',slug:'related-film',title:'A related film'}];
  const html=renderToStaticMarkup(await Page({locale:'en',kind:'films',slug:'test-film'}));
  for(const text of ['The complete synopsis.','Actual camera notes.','Lighting setup','04:32','Credits','Film still'])assert.ok(html.includes(text),text);
  assert.ok(html.includes('cinematic-film'));assert.ok(!html.includes('<iframe'));assert.ok(html.includes('video-start'));
  assert.ok(html.includes('A related film'));
  const metadata=await portfolioMetadata('en','films','test-film');assert.equal(metadata.alternates.canonical,'/en/films/test-film');assert.equal(metadata.openGraph.images[0].url,'/icon.png');
  const commercial=renderToStaticMarkup(await Page({locale:'en',kind:'commercial',slug:'test-film'}));assert.ok(commercial.includes('Spec Work'));assert.ok(!commercial.includes('Do not claim this is a client'));
  portfolio.getProjects=async()=>[];
  assert.ok(renderToStaticMarkup(await Page({locale:'en',kind:'films'})).includes('New films are in the making.'));
  assert.ok(renderToStaticMarkup(await Page({locale:'mk',kind:'commercial'})).includes('Простор за идни соработки.'));
  await assert.rejects(()=>Page({locale:'en',kind:'films',slug:'missing'}),/404/);
 }finally{portfolio.getProjects=oldProjects;sanity.getSiteContent=oldSite;}
});
