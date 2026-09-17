import { getSubmissions, createSubmission } from '../storage-service.js';
import { getCurrentUser, onAuthStateChange } from '../auth.js';
import { showToast } from '../components/toast.js';

const SAVED_KEY='alumni_saved_stories';
const DEFAULT_IMAGE='https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80';

const students=[
 {name:'Aarav Das',department:'Computer Science & Engineering',branch:'CSE-AIML',year:'2023–2027',company:'TCS',package:'₹9 LPA',image:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80'},
 {name:'Ananya Mohanty',department:'Computer Science & Engineering',branch:'CSE',year:'2023–2027',company:'Deloitte',package:'₹8.5 LPA',image:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80'},
 {name:'Ritwik Sahu',department:'Electronics & Communication Engineering',branch:'ECE',year:'2022–2026',company:'Infosys',package:'₹7.5 LPA',image:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80'},
 {name:'Sneha Patnaik',department:'Information Technology',branch:'IT',year:'2023–2027',company:'Wipro',package:'₹7.2 LPA',image:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80'},
 {name:'Aditya Rout',department:'Mechanical Engineering',branch:'ME',year:'2022–2026',company:'Capgemini',package:'₹6.8 LPA',image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80'},
 {name:'Priya Behera',department:'Electrical Engineering',branch:'EE',year:'2023–2027',company:'Accenture',package:'₹6.5 LPA',image:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80'}
];

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

const saved=()=>{
  try{
    return JSON.parse(localStorage.getItem(SAVED_KEY)||'[]');
  }catch{
    return[];
  }
};

const setSaved=v=>
  localStorage.setItem(SAVED_KEY,JSON.stringify(v));

const esc=v=>
  String(v??'').replace(/[&<>'"]/g,c=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    "'":'&#39;',
    '"':'&quot;'
  }[c]));

const categoryLabel=c=>({
  Story:'Stories & Essays',
  Achievement:'Breakthroughs',
  News:'Campus Milestones'
})[c]||c;

const words=t=>
  String(t||'').trim().split(/\s+/).filter(Boolean).length;

const readTime=t=>
  Math.max(1,Math.ceil(words(t)/220));

const storyId=(s,i)=>
  String(s.id||s.uid||`${s.title||'story'}-${i}`);

const authorName=s=>
  s.authorName||s.author||'GIET Community';

const authorPhoto=s=>
  s.authorPhotoURL||s.authorImage||s.authorAvatar||DEFAULT_IMAGE;

const authorLink=s=>
  s.authorUid
    ? `profile.html?id=${encodeURIComponent(s.authorUid)}`
    : '#';

let stories=[];


async function loadStories(){
  try{
    stories=await getSubmissions('approved')||[];
  }catch(e){
    stories=[];
  }

  renderStories('All');
}


function byDate(a,b){
  const da=new Date(
    a.createdAt||a.date||a.publishedAt||0
  ).getTime();

  const db=new Date(
    b.createdAt||b.date||b.publishedAt||0
  ).getTime();

  return db-da;
}


function renderStories(filter='All'){

  const base=
    filter==='Saved'
      ? stories.filter((s,i)=>saved().includes(storyId(s,i)))
      : filter==='All'
        ? stories
        : stories.filter(s=>(s.category||'News')===filter);

  const list=[...base].sort(byDate);
  const grid=$('#news-grid');

  if(!list.length){

    grid.innerHTML=`
      <div class="empty-state">
        <h3>No stories here yet.</h3>
        <p>Be the first GIET alumnus to share one.</p>
      </div>
    `;

    $('#trending-list').innerHTML='';
    return;
  }

  grid.innerHTML=list
    .map((s,i)=>
      cardHTML(
        s,
        stories.indexOf(s),
        i===0&&filter!=='Saved'
      )
    )
    .join('');

  const trend=[...stories]
    .filter(s=>(s.category||'')==='Achievement')
    .sort(byDate)
    .slice(0,5);

  const trendList=trend.length?trend:list.slice(0,5);

  $('#trending-list').innerHTML=
    trendList.map((s,i)=>`
      <li>
        <b>${String(i+1).padStart(2,'0')}</b>

        <div>
          <a
            href="#"
            data-read="${esc(storyId(s,stories.indexOf(s)))}"
          >
            ${esc(s.title||'GIET Alumni Story')}
          </a>

          <span class="trending-meta">
            ${esc(categoryLabel(s.category||'News'))}
            ·
            ${readTime(s.body||s.content)} min read
          </span>
        </div>
      </li>
    `)
    .join('');
}


function cardHTML(s,index,isLead){

  const id=storyId(s,index);

  const isSaved=saved().includes(id);

  const image=esc(
    s.imageUrl||s.image||DEFAULT_IMAGE
  );

  const photo=esc(authorPhoto(s));

  return `
    <article class="news-card ${isLead?'lead-story':''}">

      <div class="card-media">

        <img
          src="${image}"
          alt="${esc(s.title||'GIET alumni story')}"
          loading="lazy"
        >

        ${isLead
          ? '<span class="lead-badge">Lead feature</span>'
          : ''
        }

      </div>


      <div class="${isLead?'lead-copy':''}">

        <div class="card-meta">

          <span>
            ${esc(categoryLabel(s.category||'News'))}
          </span>

          <button
            class="save-btn ${isSaved?'saved':''}"
            data-save="${esc(id)}"
            aria-label="${isSaved?'Remove from saved stories':'Save story'}"
          >
            ${isSaved?'♥':'♡'}
          </button>

        </div>


        <h3>

          <a
            href="#"
            data-read="${esc(id)}"
          >
            ${esc(s.title||'GIET Alumni Story')}
          </a>

        </h3>


        <p>
          ${esc(
            s.excerpt||
            'A story from the GIET University community.'
          )}
        </p>


        <div class="card-meta">

          <a
            class="author-line"
            href="${authorLink(s)}"
          >

            <img
              class="author-avatar"
              src="${photo}"
              alt=""
            >

            <span>
              ${esc(authorName(s))}
            </span>

          </a>

          <span>
            ${readTime(s.body||s.content)} min read
          </span>

        </div>

      </div>

    </article>
  `;
}


function formatDate(value){

  if(!value)return'Gazette Desk';

  const d=new Date(value);

  return Number.isNaN(d.getTime())
    ? 'Gazette Desk'
    : d.toLocaleDateString(
        undefined,
        {
          year:'numeric',
          month:'long',
          day:'numeric'
        }
      );
}


function openReader(story){

  if(!story)return;

  const paras=
    String(
      story.body||
      story.content||
      story.excerpt||
      ''
    )
    .split(/\n+/)
    .map(x=>x.trim())
    .filter(Boolean);

  const quote=
    paras.length>2
      ? paras[
          Math.floor(paras.length/2)
        ].slice(0,180)
      : 'Stories from GIET continue to connect people, ideas and progress.';

  const body=
    paras
      .map((p,i)=>
        i===Math.floor(paras.length/2)&&paras.length>3
          ? `
            <blockquote class="pull-quote">
              “${esc(quote)}”
            </blockquote>

            <p>
              ${esc(p)}
            </p>
          `
          : `
            <p class="${i===0?'dropcap':''}">
              ${esc(p)}
            </p>
          `
      )
      .join('');

  const company=
    story.authorCompany||
    story.currentCompany||
    'GIET University Alumni';

  const title=
    story.authorTitle||
    story.currentTitle||
    'Community Contributor';

  const grad=
    story.graduationYear||
    story.gradYear||
    '';


  $('#reader-modal-body').innerHTML=`

    <div class="reader-content">

      <img
        class="reader-hero"
        src="${esc(
          story.imageUrl||
          story.image||
          DEFAULT_IMAGE
        )}"
        alt="${esc(
          story.title||
          'GIET alumni story'
        )}"
      >


      <div class="reader-inner">

        <div class="reader-kicker">

          <span class="lead-badge">
            ${esc(
              categoryLabel(
                story.category||'News'
              )
            )}
          </span>

          <span class="read-pill">
            ${readTime(
              story.body||
              story.content
            )}
            min read · Vol. 04 · Issue 09
          </span>

        </div>


        <h1 id="reader-title">
          ${esc(
            story.title||
            'GIET Alumni Story'
          )}
        </h1>


        <p class="reader-deck">
          ${esc(
            story.excerpt||
            'A story from the GIET University community.'
          )}
        </p>


        <div class="reader-byline">

          <img
            src="${esc(authorPhoto(story))}"
            alt=""
          >

          <div>

            By
            <a href="${authorLink(story)}">
              ${esc(authorName(story))}
            </a>

            <br>

            <span>
              ${esc(
                formatDate(
                  story.createdAt||
                  story.date||
                  story.publishedAt
                )
              )}
            </span>

          </div>

        </div>


        <div class="reader-body">

          ${
            body||
            '<p>Full story details will appear here once published.</p>'
          }

        </div>


        <div class="reader-share">

          <strong>
            Share this story
          </strong>

          <button
            class="share-btn"
            data-share="copy"
          >
            Copy link
          </button>

          <button
            class="share-btn"
            data-share="native"
          >
            Share
          </button>

        </div>


        <div class="author-callout">

          <img
            src="${esc(authorPhoto(story))}"
            alt=""
          >

          <div>

            <h3>
              ${esc(authorName(story))}
            </h3>

            <p>
              ${esc(
                grad
                  ? `Class of ${grad} · `
                  : ''
              )}
              ${esc(title)}
              ·
              ${esc(company)}
            </p>

            <a href="${authorLink(story)}">
              View Fellow Profile →
            </a>

          </div>

        </div>

      </div>

    </div>
  `;


  const modal=$('#reader-modal');

  modal.classList.add('open');

  modal.setAttribute(
    'aria-hidden',
    'false'
  );
}


async function shareStory(mode){

  const url=location.href;

  if(mode==='copy'){

    try{

      await navigator.clipboard.writeText(url);

      showToast?.(
        'Story link copied.'
      );

    }catch{

      showToast?.(
        'Copy is unavailable in this browser.'
      );

    }

  }else if(navigator.share){

    try{

      await navigator.share({
        title:document.title,
        url
      });

    }catch{}

  }else{

    try{

      await navigator.clipboard.writeText(url);

      showToast?.(
        'Story link copied.'
      );

    }catch{

      showToast?.(
        'Sharing is unavailable.'
      );

    }

  }
}


function toggleSave(id){

  const a=saved();

  const has=a.includes(id);

  const n=
    has
      ? a.filter(x=>x!==id)
      : [...a,id];

  setSaved(n);

  const active=
    document.querySelector(
      '.filter-btn.active'
    )?.dataset.category||'All';

  renderStories(active);

  showToast?.(
    has
      ? 'Removed from saved stories'
      : 'Saved to My Saved Stories'
  );
}


function setupSlider(){

  const slider=$('#campus-slider');

  const cards=$$('.slide-card');

  const dots=$('#slider-dots');

  let index=0;


  cards.forEach((_,i)=>{

    const b=document.createElement('button');

    b.className=
      'slider-dot'+
      (i===0?' active':'');

    b.type='button';

    b.addEventListener(
      'click',
      ()=>go(i)
    );

    dots.appendChild(b);

  });


  function go(i){

    index=
      (i+cards.length)%cards.length;

    slider.scrollTo({
      left:index*slider.clientWidth,
      behavior:'smooth'
    });

    $$('.slider-dot').forEach(
      (d,j)=>
        d.classList.toggle(
          'active',
          j===index
        )
    );

  }


  $('#slide-next').onclick=
    ()=>go(index+1);

  $('#slide-prev').onclick=
    ()=>go(index-1);


  let timer=
    setInterval(
      ()=>go(index+1),
      5500
    );


  slider.addEventListener(
    'mouseenter',
    ()=>clearInterval(timer)
  );


  slider.addEventListener(
    'mouseleave',
    ()=>timer=setInterval(
      ()=>go(index+1),
      5500
    )
  );

}


function renderPlacements(){

  $('#placement-students').innerHTML=
    students
      .map(s=>`

        <article class="student-placement-card">

          <img
            src="${s.image}"
            alt="${esc(s.name)}"
          >

          <div class="student-info">

            <h3>
              ${esc(s.name)}
            </h3>

            <p>
              <strong>Department:</strong>
              ${esc(s.department)}
            </p>

            <p>
              <strong>Branch:</strong>
              ${esc(s.branch)}
            </p>

            <p>
              <strong>Academic Year:</strong>
              ${esc(s.year)}
            </p>


            <div class="student-company">

              <span>
                Placed at<br>
                <strong>
                  ${esc(s.company)}
                </strong>
              </span>

              <strong class="package">
                ${esc(s.package)}
              </strong>

            </div>

          </div>

        </article>

      `)
      .join('');
}


function openPlacements(){

  history.pushState(
    {placements:true},
    '',
    `${location.pathname}#placements`
  );

  $('#gazette-main').hidden=true;

  $('#placements-page').hidden=false;

  window.scrollTo({
    top:0,
    behavior:'smooth'
  });

}


function closePlacements(){

  if(location.hash==='#placements'){
    history.pushState(
      {},
      '',
      location.pathname
    );
  }

  $('#placements-page').hidden=true;

  $('#gazette-main').hidden=false;

  window.scrollTo({
    top:0,
    behavior:'smooth'
  });

}


function syncHash(){

  if(location.hash==='#placements'){

    renderPlacements();

    $('#gazette-main').hidden=true;

    $('#placements-page').hidden=false;

  }else{

    $('#placements-page').hidden=true;

    $('#gazette-main').hidden=false;

  }

}


function setupSubmit(){

  const modal=$('#submit-story-modal');


  const open=()=>{

    const user=getCurrentUser?.();

    if(!user){

      showToast?.(
        'Please sign in to submit a story.'
      );

      window.location.href='auth.html';

      return;
    }

    modal.classList.add('open');

    modal.setAttribute(
      'aria-hidden',
      'false'
    );

    $('#story-title').focus();

  };


  $('#share-story-btn').onclick=open;


  $$('[data-close-submit]').forEach(
    b=>b.onclick=()=>{

      modal.classList.remove(
        'open'
      );

      modal.setAttribute(
        'aria-hidden',
        'true'
      );

    }
  );


  $('#story-title').addEventListener(
    'input',
    e=>
      $('#title-count').textContent=
        `${e.target.value.length}/120`
  );


  $('#story-body').addEventListener(
    'input',
    e=>{

      const w=words(
        e.target.value
      );

      $('#body-count').textContent=
        `${w} words`;

      $('#reading-time').textContent=
        `${Math.max(
          1,
          Math.ceil(w/220)
        )} min read`;

    }
  );


  $('#story-image').addEventListener(
    'input',
    e=>{

      const img=
        $('#story-image-preview');

      if(e.target.value){

        img.src=e.target.value;

        img.hidden=false;

        img.onerror=()=>{
          img.hidden=true;
        };

      }else{

        img.hidden=true;

      }

    }
  );


  $('#story-submission-form').onsubmit=
    async e=>{

      e.preventDefault();

      const user=getCurrentUser?.();

      if(!user){

        showToast?.(
          'Please sign in first.'
        );

        return;

      }


      const data={

        title:
          $('#story-title').value.trim(),

        category:
          $('#story-category').value,

        excerpt:
          $('#story-excerpt').value.trim(),

        imageUrl:
          $('#story-image').value.trim(),

        body:
          $('#story-body').value.trim(),

        authorUid:
          user.uid,

        status:
          'pending'

      };


      try{

        await createSubmission(
          data
        );

        modal.classList.remove(
          'open'
        );

        modal.setAttribute(
          'aria-hidden',
          'true'
        );

        e.target.reset();

        $('#story-image-preview').hidden=true;

        $('#title-count').textContent=
          '0/120';

        $('#body-count').textContent=
          '0 words';

        $('#reading-time').textContent=
          '1 min read';

        showToast?.(
          'Cataloged for staff review in the University Gazette moderation queue.'
        );

      }catch(err){

        showToast?.(
          'Could not submit the story. Please try again.'
        );

      }

    };

}


document.addEventListener(
  'click',
  e=>{

    const read=
      e.target.closest('[data-read]');

    if(read){

      e.preventDefault();

      openReader(
        stories.find(
          (s,i)=>
            storyId(s,i)===
            read.dataset.read
        )
      );

    }


    const save=
      e.target.closest('[data-save]');

    if(save){

      e.preventDefault();

      toggleSave(
        save.dataset.save
      );

    }


    const share=
      e.target.closest('[data-share]');

    if(share){

      e.preventDefault();

      shareStory(
        share.dataset.share
      );

    }

  }
);


$('#close-reader-modal').onclick=()=>{

  $('#reader-modal').classList.remove(
    'open'
  );

  $('#reader-modal').setAttribute(
    'aria-hidden',
    'true'
  );

};


$('#reader-modal').addEventListener(
  'click',
  e=>{

    if(e.target.id==='reader-modal'){
      $('#close-reader-modal').click();
    }

  }
);


$('#placements-spotlight').onclick=
  openPlacements;


$('#placements-back').onclick=
  closePlacements;


window.addEventListener(
  'popstate',
  syncHash
);


window.addEventListener(
  'hashchange',
  syncHash
);


$$('.filter-btn').forEach(
  btn=>
    btn.addEventListener(
      'click',
      ()=>{
        $$('.filter-btn').forEach(
          b=>b.classList.remove(
            'active'
          )
        );

        btn.classList.add(
          'active'
        );

        renderStories(
          btn.dataset.category
        );
      }
    )
);


setupSlider();

setupSubmit();

syncHash();

renderPlacements();

loadStories();

onAuthStateChange?.(
  ()=>{}
);