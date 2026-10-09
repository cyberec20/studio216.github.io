#!/usr/bin/env python3
"""Validate Studios216 institutional brand lockup in source and Pages artifact."""
from pathlib import Path
import argparse,re,sys

ROOT=Path(__file__).resolve().parents[1]
FAMILIES=(
 'email-hypnotic-motivation','email-motivacion-hipnotica',
 'impulsador-confianza-hipnotica','lenny-the-little-sea-lion-learns-kindness',
 'maxima-relajacion','storytelling-con-datos',
 'storytelling-tactics-exciting-speeches','tecnicas-visualizacion-datos'
)
BASE=(
 'index.html','products/index.html','about.html','about/founder/index.html'
)
MUST_NOT_BRAND=(
 'wattswise/index.html','wattswise/es/index.html',
 'diffdocs/index.html','diffdocs/es/index.html'
)
CSS='/assets/css/institutional-brand.css'
BRAND='studio-brand-lockup'
WORD='studio-brand-wordmark'

def validate(root:Path):
 failures=[]
 candidates=[root/name for name in BASE]
 candidates += [root/x/'index.html' for x in FAMILIES]
 candidates += [root/x/'es'/'index.html' for x in FAMILIES]
 candidates += list((root/'articles').rglob('index.html'))
 if (root/'templates').exists():
  candidates += [root/'templates/article.html',root/'templates/articles-index.html']
 unique={p.resolve():p for p in candidates}
 checked=0
 for p in sorted(unique.values()):
  if not p.is_file():
   if p.parent.name=='es' and p.parent.parent.name in FAMILIES:
    continue # Some institutional products have only one localized landing
   failures.append(f'{p.relative_to(root)}: missing page')
   continue
  body=p.read_text(encoding='utf-8')
  head=re.search(r'<header\b[^>]*>.*?</header>',body,re.I|re.S)
  if not head:
   failures.append(f'{p.relative_to(root)}: missing site header')
   continue
  markup=head.group(0)
  if (markup.count(BRAND)!=1 or markup.count(WORD)!=2 or
      'studio_logo.jpeg' not in markup or
      'studio-brand-wordmark__number">216</span>' not in markup or
      f'href="{CSS}"' not in body):
   failures.append(f'{p.relative_to(root)}: incorrect institutional lockup or stylesheet')
   continue
  if not re.search(r'<a\b[^>]*class="[^"]*\bstudio-brand-lockup\b[^"]*"[^>]*>\s*<img\b[^>]*studio_logo\.jpeg',markup,re.I|re.S):
   failures.append(f'{p.relative_to(root)}: wordmark not anchored with original logo')
   continue
  checked+=1
 for rel in MUST_NOT_BRAND:
  p=root/rel
  if p.exists() and (BRAND in p.read_text(encoding='utf-8') or WORD in p.read_text(encoding='utf-8')):
   failures.append(f'{rel}: independent product identity was altered')
 css=root/CSS.lstrip('/')
 if not css.is_file():
  failures.append('shared stylesheet absent')
 else:
  c=css.read_text(encoding='utf-8')
  if not all(k in c for k in ('.studio-brand-lockup','.studio-brand-wordmark','max-width: 690px')):
   failures.append('shared stylesheet missing responsive contract')
 if failures:
  print('FAIL institutional brand:',len(failures),'issues')
  print('\n'.join(' - '+x for x in failures))
  return 1
 print(f'PASS institutional brand: {checked} institutional pages, protected product brands, responsive CSS')
 return 0

def main():
 ap=argparse.ArgumentParser()
 ap.add_argument('--root',type=Path,default=ROOT)
 args=ap.parse_args()
 raise SystemExit(validate(args.root.resolve()))

if __name__=='__main__':
 main()
