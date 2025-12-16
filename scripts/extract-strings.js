#!/usr/bin/env node
/*
 Simple extractor: walks .tsx files under provided directories (defaults: app components)
 Collects likely user-facing strings from JSX text nodes and common attributes (title, aria-label, placeholder)
 Writes `app/locales/en.json` and `i18n-strings.json` with generated keys.

Usage:
  node scripts/extract-strings.js [paths...]

Note: This is a conservative extractor — manual review is required.
*/

const fs = require('fs')
const path = require('path')
// no external deps: implement simple recursive walk

function walkDir(dir, exts){
  const out = []
  const items = fs.readdirSync(dir, { withFileTypes: true })
  for (const it of items){
    const p = path.join(dir, it.name)
    if (it.isDirectory()){
      out.push(...walkDir(p, exts))
    } else if (it.isFile()){
      for (const e of exts){
        if (p.endsWith(e)) { out.push(p); break }
      }
    }
  }
  return out
}

function slugify(s){
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 80)
}

function collectFromFile(filePath){
  const content = fs.readFileSync(filePath, 'utf8')
  const results = new Set()

  // Match simple JSX text between >text< (skip tags with only whitespace)
  const jsxTextRe = />\s*([^<>\n]{2,}?)\s*</g
  let m
  while ((m = jsxTextRe.exec(content)) !== null){
    const s = m[1].trim()
    if (s && !/^\{/.test(s) && /[A-Za-zА-Яа-я0-9]/.test(s)){
      results.add(s)
    }
  }

  // Match attributes like title="..." or placeholder='...'
  const attrRe = /(title|placeholder|aria-label|alt)=\{"?(?:')?([^"'<>]{1,200})/gi
  while ((m = attrRe.exec(content)) !== null){
    const s = m[2].trim()
    if (s) results.add(s)
  }

  return Array.from(results)
}

async function main(){
  const args = process.argv.slice(2)
  const roots = args.length ? args : ['app','components']

  const files = []
  for (const r of roots){
    const full = path.join(process.cwd(), r)
    if (!fs.existsSync(full)) continue
    files.push(...walkDir(full, ['.ts', '.tsx', '.js', '.jsx']))
  }

  const all = {}
  const en = {}

  for (const f of files){
    if (!f.endsWith('.tsx') && !f.endsWith('.jsx')) continue
    try{
      const items = collectFromFile(f)
      if (items.length){
        all[f] = items
        for (const s of items){
          const key = slugify(s)
          // ensure uniqueness
          let candidate = key || 'text'
          let i = 1
          while (en[candidate]){
            candidate = `${key}_${i++}`
          }
          en[candidate] = s
        }
      }
    }catch(e){
      console.error('skip', f, e.message)
    }
  }

  const outDir = path.join(process.cwd(), 'app', 'locales')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const enPath = path.join(outDir, 'en.json')
  const i18nMapPath = path.join(process.cwd(), 'i18n-strings.json')

  fs.writeFileSync(enPath, JSON.stringify(en, null, 2))
  fs.writeFileSync(i18nMapPath, JSON.stringify(all, null, 2))

  // also ensure ru.json exists; if absent, copy en -> ru
  const ruPath = path.join(outDir, 'ru.json')
  if (!fs.existsSync(ruPath)){
    fs.writeFileSync(ruPath, JSON.stringify(en, null, 2))
  }

  console.log('Extracted strings:', Object.keys(en).length)
  console.log('Wrote', enPath)
  console.log('Wrote', i18nMapPath)
}

main().catch(e=>{ console.error(e); process.exit(1) })
