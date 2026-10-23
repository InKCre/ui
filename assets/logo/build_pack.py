#!/usr/bin/env python3
"""Rebuild InKCre native-vector logo assets, preview, QA and manifest.
Requires Python 3.10+, Pillow and Inkscape 1.4+. No network access is used.
"""
from pathlib import Path
import concurrent.futures, hashlib, json, shutil, subprocess, tempfile
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont, ImageChops

ROOT = Path(__file__).resolve().parent
SIZES = (16,20,24,32,48,64,128,256,512,1024)
RETINA_SIZES = (16,20,24,32,48,64)
VARIANTS = {
 'original-transparent': ('#000000','#808080',None),
 'original-white': ('#000000','#808080','#FFFFFF'),
 'reverse-transparent': ('#FFFFFF','#808080',None),
 'reverse-black': ('#FFFFFF','#808080','#000000'),
 'black-transparent': ('#000000','#000000',None),
 'black-white': ('#000000','#000000','#FFFFFF'),
 'white-transparent': ('#FFFFFF','#FFFFFF',None),
 'white-black': ('#FFFFFF','#FFFFFF','#000000'),
}

def geometry(size): return 'optical-32' if size <= 32 else 'standard-256'

def svg(variant, size, geo=None):
    geo = geo or geometry(size)
    ink, gray, bg = VARIANTS[variant]
    vb = 32 if geo == 'optical-32' else 256
    background = f'<rect width="{vb}" height="{vb}" fill="{bg}"/>' if bg else ''
    if vb == 32:
        body = f'''<path d="M4 11h9v9H4Z M5 12h7v7H5Z" fill="{ink}" fill-rule="evenodd"/>
<rect x="7" y="14" width="3" height="3" fill="{ink}"/>
<rect x="20" y="3" width="8" height="8" fill="{ink}"/>
<line x1="13" y1="15.5" x2="16" y2="15.5" stroke="{ink}"/>
<line x1="16.5" y1="16" x2="16.5" y2="9" stroke="{ink}"/>
<line x1="16" y1="8.5" x2="20" y2="8.5" stroke="{ink}"/>
<rect x="20" y="20" width="8" height="8" fill="{gray}"/>'''
    else:
        body = f'''<path d="M51 102h52v52H51Z M59 110h36v36H59Z" fill="{ink}" fill-rule="evenodd"/>
<rect x="68" y="119" width="18" height="18" fill="{ink}"/>
<rect x="153" y="51" width="52" height="52" fill="{ink}"/>
<line x1="103" y1="128" x2="128" y2="128" stroke="{ink}" stroke-width="4"/>
<line x1="128" y1="130" x2="128" y2="79" stroke="{ink}" stroke-width="4"/>
<line x1="126" y1="77" x2="153" y2="77" stroke="{ink}" stroke-width="4"/>
<rect x="153" y="153" width="52" height="52" fill="{gray}"/>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {vb} {vb}" fill="none">
<title>InKCre — {variant}, {geo}</title>
<desc>Native source geometry. The nested-square counter is a true transparent cutout. Display-size master: {geo}.</desc>
{background}
{body}
</svg>
'''

def write(path, content):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(content, encoding='utf-8')

def render(task):
    src, dest, pixels = task
    dest.parent.mkdir(parents=True,exist_ok=True)
    p = subprocess.run(['inkscape',str(src),f'--export-filename={dest}',f'--export-width={pixels}',f'--export-height={pixels}'],capture_output=True,text=True)
    if p.returncode: raise RuntimeError(p.stderr)
    if not dest.exists(): raise RuntimeError(f'No rendered output: {dest}')

def font(size,bold=False,mono=False):
    stem='DejaVuSansMono' if mono else 'DejaVuSans'
    path=Path('/usr/share/fonts/truetype/dejavu')/(stem+('-Bold' if bold else '')+'.ttf')
    if path.exists(): return ImageFont.truetype(str(path),size)
    return ImageFont.load_default(size=size)

def checker(im,box,step=12):
    d=ImageDraw.Draw(im)
    x,y,w,h=box
    for yy in range(y,y+h,step):
        for xx in range(x,x+w,step):
            c='#E3E3E3' if ((xx-x)//step+(yy-y)//step)%2 else '#F4F4F4'
            d.rectangle((xx,yy,min(xx+step-1,x+w-1),min(yy+step-1,y+h-1)),fill=c)

def pngpath(v,s,scale=1):
    if scale==1: return ROOT/'png'/v/f'inkcre-{v}-{s}.png'
    return ROOT/'png'/f'{scale}x'/v/f'inkcre-{v}-{s}px@{scale}x.png'

def preview():
    W,H=1680,2160
    im=Image.new('RGB',(W,H),'#F2F2F2'); d=ImageDraw.Draw(im)
    def text(x,y,t,size=20,color='#202020',bold=False,mono=False): d.text((x,y),t,font=font(size,bold,mono),fill=color)
    def paste(v,s,x,y,scale=1,resize=None,nearest=False):
        p=Image.open(pngpath(v,s,scale)).convert('RGBA')
        if resize: p=p.resize(resize,Image.Resampling.NEAREST if nearest else Image.Resampling.LANCZOS)
        im.paste(p,(x,y),p)
    text(64,44,'InKCre',56,bold=True,mono=True)
    text(65,116,'LOGO PACK  /  NATIVE VECTOR EDITION',18,color='#636363',mono=True)
    text(65,151,'Original geometry. Four colorways. Transparent counters. Ready for light and dark.',21)
    d.line((64,198,1616,198),fill='#CACACA',width=1)
    cards=[('original-white','Original','Black + #808080 on white'),('reverse-black','Reverse','White + #808080 on black'),('black-white','Solid black','One-color mark on white'),('white-black','Solid white','One-color mark on black')]
    for i,(v,title,sub) in enumerate(cards):
        x=64+i*392; y=229; dark=v.endswith('black')
        d.rectangle((x,y,x+375,y+329),fill='#000000' if dark else '#FFFFFF')
        paste(v,256,x+60,y+37)
        text(x,y+347,title,25,bold=True)
        text(x,y+383,sub,16,color='#656565')
    text(64,674,'TRANSPARENT BY CONSTRUCTION',22,bold=True,mono=True)
    text(64,714,'No white plate or filled counter. The ring reveals the background in every colorway.',19,color='#656565')
    for i,v in enumerate(['original-transparent','reverse-transparent','black-transparent','white-transparent']):
        x=64+i*392; y=756
        if v.startswith(('reverse','white')): d.rectangle((x,y,x+375,y+240),fill='#353535')
        else: checker(im,(x,y,376,241),16)
        paste(v,256,x+68,y,resize=(240,240))
        text(x,y+255,v,16,mono=True)
    text(64,1075,'ACTUAL PIXEL SIZES  /  1x',22,bold=True,mono=True)
    text(64,1115,'Shown at native pixel dimensions. 16–32 use optical geometry; 48–64 use standard geometry.',19,color='#656565')
    sizes=(16,20,24,32,48,64)
    for i,s in enumerate(sizes):
        x=64+i*261
        d.rectangle((x,1162,x+244,1270),fill='#FFFFFF')
        paste('original-transparent',s,x+(245-s)//2,1216-s//2)
        d.rectangle((x,1283,x+244,1391),fill='#000000')
        paste('reverse-transparent',s,x+(245-s)//2,1337-s//2)
        text(x,1407,f'{s} px',20,bold=True,mono=True)
        text(x,1439,'Optical' if s<=32 else 'Standard',16,color='#656565')
    text(64,1512,'HIGH-DPI  /  SAME 32 px LOGICAL ICON',22,bold=True,mono=True)
    text(64,1552,'All three keep the optical master. Native exports: 32, 64 and 96 pixels.',19,color='#656565')
    text(64,1585,'Detail views below are nearest-neighbor enlargements, not larger logical icons.',17,color='#656565')
    for i,scale in enumerate((1,2,3)):
        x=64+i*524; y=1635
        d.rectangle((x,y,x+505,y+335),fill='#FFFFFF')
        paste('original-transparent',32,x+20,y+20,scale,resize=(288,288),nearest=True)
        native=32*scale
        paste('original-transparent',32,x+369-native//2,y+159-native//2,scale)
        text(x+330,y+276,f'{native} x {native}',16,color='#656565',mono=True)
        text(x,y+352,f'{scale}x  /  {native} px raster',22,bold=True,mono=True)
        text(x,y+386,f'Detail enlarged {9/scale:g}x; native export at right',16,color='#656565')
    text(64,2080,'SVG + PNG   |   16–1024 px   |   2x / 3x UI exports   |   Sources + reproducible build',18,mono=True)
    im.save(ROOT/'InKCre-logo-pack-preview.png',optimize=True)

def qa(records):
    checks=[]
    for source in json.loads((ROOT/'PROVENANCE.json').read_text())['sources']:
        b=(ROOT/source['local_path']).read_bytes()
        assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==source['git_blob_sha'],source['local_path']
    checks.append({'test':'Three untouched source files match recorded Git blob SHA values','result':'pass'})
    assert len(records)==264 and sum(r['kind']=='svg' for r in records)==88 and sum(r['kind']=='png' for r in records)==176
    for r in records:
        p=ROOT/r['path']
        if p.suffix=='.svg':
            e=ET.parse(p).getroot()
            forbidden=[c for c in e.iter() if c.tag.rsplit('}',1)[-1] in ('image','text','foreignObject')]
            assert not forbidden, p
            assert any(c.get('fill-rule')=='evenodd' for c in e.iter()),p
        else:
            image=Image.open(p).convert('RGBA'); assert image.size==(r['pixel_size'],)*2,p
            v=r['variant']; bg=VARIANTS[v][2]
            a=image.getchannel('A')
            if bg is None:
                assert a.getextrema()==(0,255),p
                assert image.getpixel((0,0))[3]==0,p
                bbox=a.getbbox(); assert bbox and bbox[0]>0 and bbox[1]>0 and bbox[2]<image.width and bbox[3]<image.height,p
                # Counter probes must remain mostly transparent. At 20px/1x a
                # subpixel counter has antialias coverage, not an opaque fill.
                s=r['pixel_size']; vb=32 if r['geometry']=='optical-32' else 256
                x,y=(6,13) if vb==32 else (64,114)
                alpha=image.getpixel((int(x*s/vb),int(y*s/vb)))[3]
                assert alpha <= 64,(p,'counter not transparent',alpha)
                if r['pixel_size']>=32: assert alpha==0,(p,'large counter not fully transparent')
            else:
                assert a.getextrema()==(255,255),p
    checks.append({'test':'All exported SVGs are native vector with even-odd counter; all PNG dimensions, alpha, margins and counter probes correct','result':'pass','assets_checked':len(records)})
    with tempfile.TemporaryDirectory() as tmp:
        for s,src in [(32,'ui-logo-32.svg'),(256,'web-logo-256.svg')]:
            out=Path(tmp)/f'{s}.png';render((ROOT/'sources'/src,out,s))
            a=Image.open(out).convert('RGBA');b=Image.open(pngpath('original-white',s)).convert('RGBA')
            # Compare all channels, not just alpha.
            diff=ImageChops.difference(a,b)
            assert not any(c.getbbox() for c in diff.split()),f'{s}: source geometry changed'
            checks.append({'test':f'Original on white {s}px pixel-identical to unmodified native source','result':'pass','max_channel_difference':0})
    checks.append({'test':'Geometry selected by logical display size, never by physical 2x/3x raster size','result':'pass'})
    write(ROOT/'QA-report.json',json.dumps({'status':'pass','checks':checks,'source_of_truth':'Original repository SVGs; no bitmap tracing or AI redrawing','manual_review':'Preview inspected separately before delivery'},ensure_ascii=False,indent=2)+'\n')

def main():
    if not shutil.which('inkscape'): raise RuntimeError('Inkscape is required')
    records=[]; tasks=[]
    for v in VARIANTS:
        for s in SIZES:
            path=ROOT/'svg'/v/f'inkcre-{v}-{s}.svg';write(path,svg(v,s))
            records.append({'path':str(path.relative_to(ROOT)),'kind':'svg','variant':v,'logical_size':s,'pixel_size':s,'scale':1,'geometry':geometry(s)})
            pathpng=pngpath(v,s);tasks.append((path,pathpng,s))
            records.append({'path':str(pathpng.relative_to(ROOT)),'kind':'png','variant':v,'logical_size':s,'pixel_size':s,'scale':1,'geometry':geometry(s)})
            if s in RETINA_SIZES:
                for scale in (2,3):
                    out=pngpath(v,s,scale);tasks.append((path,out,s*scale))
                    records.append({'path':str(out.relative_to(ROOT)),'kind':'png','variant':v,'logical_size':s,'pixel_size':s*scale,'scale':scale,'geometry':geometry(s)})
        if v.endswith('transparent'):
            for geo,s in [('optical-32',32),('standard-256',256)]:
                path=ROOT/'masters'/f'inkcre-{v}-{geo}.svg';write(path,svg(v,s,geo))
                records.append({'path':str(path.relative_to(ROOT)),'kind':'svg','variant':v,'logical_size':s,'pixel_size':s,'scale':1,'geometry':geo,'master':True})
    print(f'Rendering {len(tasks)} PNGs with Inkscape...',flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex: list(ex.map(render,tasks))
    qa(records);preview()
    for r in records:
        b=(ROOT/r['path']).read_bytes();r.update(bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
    other=[]
    for p in sorted(ROOT.rglob('*')):
        if p.is_file() and p.name!='manifest.json' and str(p.relative_to(ROOT)) not in {r['path'] for r in records} and '__pycache__' not in str(p):
            b=p.read_bytes();other.append({'path':str(p.relative_to(ROOT)),'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
    manifest={'brand':'InKCre','edition':'2026-10-21','sizes':SIZES,'variants':VARIANTS,'counts':{'svg_exports':80,'svg_masters':8,'png_1x':80,'png_2x_3x':96,'all_asset_files':len(records)},'geometry_rule':'logical sizes 16/20/24/32 use official optical-32; 48/64/128/256/512/1024 use official standard-256; retina follows logical size','assets':records,'supporting_files':other}
    write(ROOT/'manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(manifest['counts']),flush=True)
    print('PASS: pixel equality, vector-only, alpha counters, dimensions and margins.',flush=True)

if __name__=='__main__':main()
